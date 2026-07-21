import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, signOut } = useAuth();

  const userAvatar = user?.user_metadata?.avatar_url;
  const userFullName = user?.user_metadata?.full_name || user?.email;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Admin Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={userAvatar} alt={userFullName} />
            <Typography variant="subtitle2">{userFullName}</Typography>
            <Button
              color="inherit"
              onClick={signOut}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">Total Partners</Typography>
              <Typography variant="h3" fontWeight="bold">
                24
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">Pending Approvals</Typography>
              <Typography variant="h3" fontWeight="bold" color="warning.main">
                5
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">System Status</Typography>
              <Typography variant="h3" fontWeight="bold" color="success.main">
                Active
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
