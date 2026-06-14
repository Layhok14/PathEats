export type TicketPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Pending";

export interface CSTicket {
  id: string;
  user: string;
  initials: string;
  avatarColor: string;
  subject: string;
  priority: TicketPriority;
  timeOpen: string;
  status: TicketStatus;
}

export interface AssignedComplaint {
  id: string;
  user: string;
  subject: string;
  status: "OPEN" | "IN PROGRESS" | "PENDING" | "RESOLVED";
  priority: "High" | "Medium" | "Low";
}

export interface RecentUpdate {
  id: string;
  title: string;
  sub: string;
  time: string;
}

export interface CustomerOrder {
  id: string;
  date: string;
  store: string;
  status: "DELIVERED" | "CANCELLED" | "PENDING";
  amount: string;
}

export interface OpenTicket {
  id: string;
  title: string;
  time: string;
  description: string;
  assignedTo: string;
}

export interface TicketHistoryItem {
  id: string;
  title: string;
  date: string;
  caseId: string;
}

export const ASSIGNED_COMPLAINTS: AssignedComplaint[] = [
  { id: "C-1021", user: "John Doe",   subject: "Food not delivered",     status: "OPEN",        priority: "High"   },
  { id: "C-1020", user: "Sarah Kim",  subject: "Wrong item received",    status: "IN PROGRESS", priority: "Medium" },
  { id: "C-1017", user: "David Lee",  subject: "App crash on checkout",  status: "IN PROGRESS", priority: "Medium" },
  { id: "C-1016", user: "Lisa Wong",  subject: "Refund not processed",   status: "PENDING",     priority: "Low"    },
];

export const RECENT_UPDATES: RecentUpdate[] = [
  { id: "u1", title: "New complaint received", sub: "From Michael Brown",     time: "10 minutes ago" },
  { id: "u2", title: "Complaint #C-1019 resolved", sub: "By Maya Santos",    time: "1 hour ago"     },
  { id: "u3", title: "User replied",            sub: "To complaint #C-1020", time: "2 hours ago"    },
];

export const CS_TICKETS: CSTicket[] = [
  { id: "TK-8821", user: "Jane Doe",     initials: "JD", avatarColor: "#dbeafe", subject: "Order #9921 marked as delivered but not received", priority: "CRITICAL", timeOpen: "2h 15m",  status: "Open"        },
  { id: "TK-8819", user: "Marcus Smith", initials: "MS", avatarColor: "#dcfce7", subject: "Vendor app crashing on route calculation",          priority: "HIGH",     timeOpen: "5h 40m",  status: "In Progress" },
  { id: "TK-8815", user: "Anna Lee",     initials: "AL", avatarColor: "#fef3c7", subject: "Incorrect dietary label on restaurant item",        priority: "MEDIUM",   timeOpen: "1d 2h",   status: "Resolved"    },
  { id: "TK-8812", user: "Robert King",  initials: "RK", avatarColor: "#f3f4f6", subject: "Update email address request",                      priority: "LOW",      timeOpen: "2d 4h",   status: "Open"        },
  { id: "TK-8809", user: "Priya Nair",   initials: "PN", avatarColor: "#ede9fe", subject: "Payment charged twice for same order",               priority: "CRITICAL", timeOpen: "30m",     status: "In Progress" },
  { id: "TK-8805", user: "Tom Baker",    initials: "TB", avatarColor: "#dcfce7", subject: "Coupon code not applied at checkout",                priority: "MEDIUM",   timeOpen: "3d 1h",   status: "Pending"     },
];

export const CUSTOMER_ORDERS: CustomerOrder[] = [
  { id: "ORD-55219", date: "Oct 24, 2023", store: "Green Garden Salads", status: "DELIVERED",  amount: "$34.20" },
  { id: "ORD-55102", date: "Oct 21, 2023", store: "Pasta & Beyond",      status: "DELIVERED",  amount: "$28.50" },
  { id: "ORD-54988", date: "Oct 18, 2023", store: "The Burger Joint",    status: "CANCELLED",  amount: "$19.00" },
];

export const OPEN_TICKETS: OpenTicket[] = [
  { id: "TK-8821", title: "Late Delivery Complaint", time: "2h ago", description: "User states that order #ORD-55219 arrived 40 minutes after…", assignedTo: "Sarah K." },
];

export const TICKET_HISTORY: TicketHistoryItem[] = [
  { id: "th1", title: "Payment Refunded", date: "Oct 12, 2023", caseId: "TK-8821" },
  { id: "th2", title: "Account Unlock",   date: "Sep 30, 2023", caseId: "TK-7710" },
  { id: "th3", title: "Voucher Applied",  date: "Sep 15, 2023", caseId: "TK-7650" },
];
