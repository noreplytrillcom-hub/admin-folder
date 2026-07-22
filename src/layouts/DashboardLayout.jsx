import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// Icons for PRD Navigation Items
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";

import { useAuth } from "../context/AuthContext";

const drawerWidth = 260;

// Pages defined in PRD
const navItems = [
  { text: "Dashboard Overview", path: "/dashboard", icon: <DashboardIcon /> },
  { text: "User Management", path: "/dashboard/users", icon: <PeopleIcon /> },
  {
    text: "Analytics & Reports",
    path: "/dashboard/analytics",
    icon: <AnalyticsIcon />,
  },
  {
    text: "Access Control",
    path: "/dashboard/access-control",
    icon: <SecurityIcon />,
  },
  {
    text: "System Settings",
    path: "/dashboard/settings",
    icon: <SettingsIcon />,
  },
];

export default function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Top Header */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "#ffffff",
          color: "#0f172a",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="600" noWrap>
            {navItems.find((item) => item.path === location.pathname)?.text ||
              "Dashboard"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              alt={user?.email || "User"}
              src={user?.user_metadata?.avatar_url}
              sx={{ width: 36, height: 36 }}
            />
            <Typography variant="body2" fontWeight="500">
              {user?.email}
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleSignOut}
              size="small"
              title="Logout"
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#0f172a",
            color: "#ffffff",
            borderRight: "none",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="700" color="#6366f1">
            Admin Portal
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

        <List sx={{ px: 2, py: 2 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive
                      ? "rgba(99, 102, 241, 0.15)"
                      : "transparent",
                    color: isActive ? "#818cf8" : "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      color: "#ffffff",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#818cf8" : "rgba(255, 255, 255, 0.7)",
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.9rem",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
            sx={{
              color: "#f87171",
              borderColor: "rgba(248, 113, 113, 0.3)",
              textTransform: "none",
              "&:hover": {
                borderColor: "#f87171",
                bgcolor: "rgba(248, 113, 113, 0.08)",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
