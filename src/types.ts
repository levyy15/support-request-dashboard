export type Role = "Viewer" | "Editor";
export type RequestStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export type SupportRequest = {
  id: string;
  requesterName: string;
  email: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: RequestStatus;
  assignedTo: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};