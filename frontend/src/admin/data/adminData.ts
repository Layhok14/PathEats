export const MOCK_TICKETS = [
  { id: "TK-88210", user: "John Doe", userType: "Premium User", subject: "Payment Failed", description: "Checkout error on Route 12 Visa card…", priority: "Critical", status: "Open", timeOpen: "12 mins ago" },
  { id: "TK-88209", user: "Burger Barn", userType: "Gold Vendor", subject: "Wrong Price", description: "Menu price mismatch between app and…", priority: "High", status: "Open", timeOpen: "24 mins ago" },
  { id: "TK-88205", user: "Sarah Ross", userType: "Standard User", subject: "App Crash", description: "App crashed during map loading on iOS…", priority: "Medium", status: "In Progress", timeOpen: "1 hour ago" },
  { id: "TK-88198", user: "Mama's Curry", userType: "Silver Vendor", subject: "Profile Update", description: "Request to change closing hours on…", priority: "Low", status: "Open", timeOpen: "3 hours ago" },
  { id: "TK-88190", user: "Alex Kim", userType: "Standard User", subject: "Missing Order", description: "Order delivered to wrong address…", priority: "High", status: "In Progress", timeOpen: "4 hours ago" },
  { id: "TK-88185", user: "The Brew Lab", userType: "Gold Vendor", subject: "Payout Delay", description: "Weekly payout not received for last week…", priority: "Critical", status: "Open", timeOpen: "5 hours ago" },
];

export const MOCK_USERS = [
  { id: "u1", name: "Sarah Jenkins", email: "sarah.j@university.edu", role: "Student", status: "Active", avatarInitials: "SJ", avatarColor: "#e0f2fe" },
  { id: "u2", name: "Green Thai Kitchen", email: "orders@greenthai.com", role: "Vendor", status: "Pending", avatarInitials: "GT", avatarColor: "#dcfce7" },
  { id: "u3", name: "Michael Chen", email: "m.chen@logistics.com", role: "Commuter", status: "Active", avatarInitials: "MC", avatarColor: "#f3f4f6" },
  { id: "u4", name: "David Wilson", email: "d.wilson@suspended.com", role: "Student", status: "Suspended", avatarInitials: "DW", avatarColor: "#f3f4f6" },
  { id: "u5", name: "Elena Rodriguez", email: "elena.rod@campus-eats.biz", role: "Vendor", status: "Active", avatarInitials: "ER", avatarColor: "#fef9c3" },
  { id: "u6", name: "James Park", email: "j.park@student.edu", role: "Student", status: "Active", avatarInitials: "JP", avatarColor: "#fce7f3" },
  { id: "u7", name: "Saffron Bowl", email: "admin@saffronbowl.com", role: "Vendor", status: "Pending", avatarInitials: "SB", avatarColor: "#ffedd5" },
  { id: "u8", name: "Nina Patel", email: "nina.p@commute.net", role: "Commuter", status: "Active", avatarInitials: "NP", avatarColor: "#e0e7ff" },
  { id: "u9", name: "Tom Bakker", email: "t.bakker@uni.edu", role: "Student", status: "Active", avatarInitials: "TB", avatarColor: "#dcfce7" },
  { id: "u10", name: "Lim Bopha", email: "lim.bopha@mail.com", role: "Commuter", status: "Suspended", avatarInitials: "LB", avatarColor: "#fce7f3" },
];

export const PENDING_RESTAURANTS = [
  { id: "r-p1", name: "Saffron Bowl", location: "Downtown Core, Lane 5", email: "admin@saffronbowl.com", category: "Fine Dining", status: "Pending", rating: null, submittedAt: "2h ago" },
  { id: "r-p2", name: "The Brew Lab", location: "Tech Park, Block B", email: "hello@brewlab.cafe", category: "Artisan Coffee", status: "Pending", rating: null, submittedAt: "5h ago" },
  { id: "r-p3", name: "Noodle Nation", location: "Waterfront Esplanade", email: "ops@noodlenation.com", category: "Fast Casual", status: "Pending", rating: null, submittedAt: "Yesterday" },
  { id: "r-p4", name: "Urban Burger Co", location: "Central Mall, Level 3", email: "info@urbanburger.com", category: "Fast Casual", status: "Pending", rating: null, submittedAt: "2 days ago" },
  { id: "r-p5", name: "Dragon Dim Sum", location: "North Wing, Plaza", email: "hello@dragondimsum.com", category: "Noodles", status: "Pending", rating: null, submittedAt: "3 days ago" },
];

export const ACTIVE_RESTAURANTS = [
  { id: "r1", name: "Urban Burger Co", location: "Central Mall, Level 3", email: "info@urbanburger.com", category: "Cafe", status: "Active", rating: 4.8, submittedAt: "3 months ago" },
  { id: "r2", name: "Dragon Dim Sum", location: "North Wing, Plaza", email: "hello@dragondimsum.com", category: "Noodles", status: "Suspended", rating: 3.2, submittedAt: "5 months ago" },
  { id: "r3", name: "Sweet Serenity", location: "East Market, Stand 12", email: "sweet@serenity.com", category: "Dessert", status: "Inactive", rating: null, submittedAt: "8 months ago" },
  { id: "r4", name: "The Golden Grain", location: "South Plaza, 1st Floor", email: "hello@goldengrain.com", category: "Rice", status: "Active", rating: 4.5, submittedAt: "4 months ago" },
  { id: "r5", name: "Mama's Curry", location: "East Block, Unit 7", email: "mamas@curry.com", category: "Street Food", status: "Active", rating: 4.1, submittedAt: "6 months ago" },
  { id: "r6", name: "The Brew Lab", location: "Tech Park, Block B", email: "hello@brewlab.cafe", category: "Cafe", status: "Active", rating: 4.6, submittedAt: "2 months ago" },
];

export const SYSTEM_ACTIVITY = [
  { id: "a1", type: "user", title: "New user registration", description: "Michael Scott joined from Scranton.", time: "2 mins ago" },
  { id: "a2", type: "restaurant", title: "Restaurant verified", description: '"La Vera Pizza" is now live.', time: "45 mins ago" },
  { id: "a3", type: "error", title: "Critical API Latency", description: "Route mapping service exceeding 500ms.", time: "1 hour ago" },
  { id: "a4", type: "backup", title: "Database Backup", description: "Automated daily snapshot completed.", time: "3 hours ago" },
];

export const GROWTH_DATA = [
  { day: "Mon", orders: 520 }, { day: "Tue", orders: 680 }, { day: "Wed", orders: 590 }, { day: "Thu", orders: 820 },
  { day: "Fri", orders: 790 }, { day: "Sat", orders: 1100 }, { day: "Sun", orders: 1340 },
];
