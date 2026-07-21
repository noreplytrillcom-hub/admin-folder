import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function UserManagement() {
  const [email, setEmail] = useState("");
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Fetch current allowed users from Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("allowed_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllowedUsers(data || []);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Add a new pre-authorized user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });

      const cleanEmail = email.toLowerCase().trim();

      const { data, error } = await supabase
        .from("allowed_users")
        .insert([{ email: cleanEmail, role: "admin" }])
        .select();

      if (error) {
        if (error.code === "23505") {
          throw new Error("This email is already authorized.");
        }
        throw error;
      }

      setMessage({
        type: "success",
        text: `Successfully authorized ${cleanEmail}!`,
      });
      setEmail("");
      fetchUsers(); // Refresh the table list
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Remove/revoke user access
  const handleDeleteUser = async (id, userEmail) => {
    if (
      !window.confirm(
        `Are you sure you want to revoke access for ${userEmail}?`,
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("allowed_users")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMessage({
        type: "success",
        text: `Revoked access for ${userEmail}`,
      });
      fetchUsers();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Authorized Team Members
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Only Google accounts added below can log into this admin portal.
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      {/* Add User Form */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box
          component="form"
          onSubmit={handleAddUser}
          sx={{ display: "flex", gap: 2, alignItems: "center" }}
        >
          <TextField
            fullWidth
            label="Google Account Email"
            variant="outlined"
            size="small"
            type="email"
            placeholder="colleague@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={
              submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <PersonAddIcon />
              )
            }
            disabled={submitting}
            sx={{ whiteSpace: "nowrap", px: 3 }}
          >
            Authorize User
          </Button>
        </Box>
      </Paper>

      {/* Authorized Users List */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>
                  <strong>Email Address</strong>
                </TableCell>
                <TableCell>
                  <strong>Role</strong>
                </TableCell>
                <TableCell>
                  <strong>Added On</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : allowedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    No authorized users found. Add one above.
                  </TableCell>
                </TableRow>
              ) : (
                allowedUsers.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteUser(item.id, item.email)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
