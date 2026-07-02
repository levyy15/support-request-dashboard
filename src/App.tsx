import { useEffect, useMemo, useState } from "react";
import { getRequests, updateRequestStatus } from "./api";
import type { RequestStatus, Role, SupportRequest } from "./types";
import "./App.css";

const statuses: RequestStatus[] = ["Open", "In Progress", "Resolved", "Closed"];

function App() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [role, setRole] = useState<Role>("Viewer");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [assignedFilter, setAssignedFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadRequests(simulateFailure = false) {
    try {
      setLoading(true);
      setError("");
      const data = await getRequests(simulateFailure);
      setRequests(data);
      setSelectedId(data[0]?.id || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const selectedRequest = requests.find((request) => request.id === selectedId);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchText = search.toLowerCase();
      const matchesSearch =
        request.requesterName.toLowerCase().includes(searchText) ||
        request.email.toLowerCase().includes(searchText);

      return (
        matchesSearch &&
        (statusFilter === "All" || request.status === statusFilter) &&
        (priorityFilter === "All" || request.priority === priorityFilter) &&
        (categoryFilter === "All" || request.category === categoryFilter) &&
        (assignedFilter === "All" || request.assignedTo === assignedFilter)
      );
    });
  }, [requests, search, statusFilter, priorityFilter, categoryFilter, assignedFilter]);

  const summary = {
    total: requests.length,
    open: requests.filter((request) => request.status === "Open").length,
    resolved: requests.filter((request) => request.status === "Resolved").length,
    high: requests.filter((request) => request.priority === "High").length,
  };

  const categories = ["All", ...new Set(requests.map((request) => request.category))];
  const assignedPeople = ["All", ...new Set(requests.map((request) => request.assignedTo))];

  async function handleStatusChange(status: RequestStatus) {
    if (!selectedRequest) return;

    try {
      setError("");
      setSuccess("");
      const updated = await updateRequestStatus(selectedRequest.id, status, role);

      setRequests((current) =>
        current.map((request) => (request.id === updated.id ? updated : request))
      );
      setSuccess(`${updated.id} updated to ${updated.status}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    }
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setCategoryFilter("All");
    setAssignedFilter("All");
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">Operations Dashboard</p>
          <h1>Support Requests</h1>
        </div>

        <label className="roleSelector">
          Role
          <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
            <option>Viewer</option>
            <option>Editor</option>
          </select>
        </label>
      </header>

      <section className="summaryGrid">
        <article><span>Total</span><strong>{summary.total}</strong></article>
        <article><span>Open</span><strong>{summary.open}</strong></article>
        <article><span>Resolved</span><strong>{summary.resolved}</strong></article>
        <article><span>High Priority</span><strong>{summary.high}</strong></article>
      </section>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <section className="filters">
        <input
          placeholder="Search by requester or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option>All</option>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>

        <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>

        <select value={assignedFilter} onChange={(event) => setAssignedFilter(event.target.value)}>
          {assignedPeople.map((person) => <option key={person}>{person}</option>)}
        </select>

        <button onClick={resetFilters}>Reset</button>
        <button className="ghost" onClick={() => loadRequests(true)}>Simulate API Error</button>
      </section>

      {loading ? (
        <p className="state">Loading support requests...</p>
      ) : (
        <section className="content">
          <div className="requestList">
            {filteredRequests.length === 0 ? (
              <p className="state">No matching support requests found.</p>
            ) : (
              filteredRequests.map((request) => (
                <button
                  className={request.id === selectedId ? "requestCard active" : "requestCard"}
                  key={request.id}
                  onClick={() => setSelectedId(request.id)}
                >
                  <strong>{request.requesterName}</strong>
                  <span>{request.email}</span>
                  <small>{request.status} · {request.priority} · {request.category}</small>
                </button>
              ))
            )}
          </div>

          <aside className="detailPanel">
            {selectedRequest ? (
              <>
                <h2>{selectedRequest.id}</h2>
                <p>{selectedRequest.message}</p>

                <dl>
                  <dt>Requester</dt><dd>{selectedRequest.requesterName}</dd>
                  <dt>Email</dt><dd>{selectedRequest.email}</dd>
                  <dt>Category</dt><dd>{selectedRequest.category}</dd>
                  <dt>Priority</dt><dd>{selectedRequest.priority}</dd>
                  <dt>Status</dt><dd>{selectedRequest.status}</dd>
                  <dt>Assigned To</dt><dd>{selectedRequest.assignedTo}</dd>
                  <dt>Created</dt><dd>{new Date(selectedRequest.createdAt).toLocaleString()}</dd>
                  <dt>Updated</dt><dd>{new Date(selectedRequest.updatedAt).toLocaleString()}</dd>
                </dl>

                <label className="statusControl">
                  Update Status
                  <select
                    value={selectedRequest.status}
                    disabled={role === "Viewer"}
                    onChange={(event) => handleStatusChange(event.target.value as RequestStatus)}
                  >
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>

                {role === "Viewer" && (
                  <p className="viewerNote">Viewer mode is read-only. Switch to Editor to update status.</p>
                )}
              </>
            ) : (
              <p className="state">Select a request to view details.</p>
            )}
          </aside>
        </section>
      )}
    </main>
  );
}

export default App;