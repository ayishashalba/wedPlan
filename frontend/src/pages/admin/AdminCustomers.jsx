import React, { useState, useEffect } from 'react';
import { Users, Search, UserCheck, UserX, Mail, Phone, Calendar } from 'lucide-react';
import { adminService } from '../../services/adminService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllUsers(roleFilter !== 'all' ? roleFilter : undefined, search);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Failed to load user accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (userId, currentIsActive) => {
    setTogglingId(userId);
    try {
      await adminService.updateUserStatus(userId, !currentIsActive);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId || u.id === userId ? { ...u, isActive: !currentIsActive } : u))
      );
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-wed-brown">
            User Account Management
          </h1>
          <p className="text-xs text-wed-brown-muted mt-1">
            Registered couples, vendors, and platform users across Kerala.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-wed-brown outline-none w-full sm:w-auto"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers Only</option>
            <option value="vendor">Vendors Only</option>
            <option value="admin">Administrators</option>
          </select>

          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px] w-full sm:w-auto">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none"
            />
          </form>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner text="Loading registered accounts from database..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-wed-cream/50 text-wed-brown font-bold border-b border-stone-200">
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Account Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((account) => {
                    const userId = account._id || account.id;
                    const isActive = account.isActive !== false;

                    return (
                      <tr key={userId} className="hover:bg-stone-50 transition">
                        <td className="p-4 font-serif font-bold text-sm text-wed-brown">
                          {account.name}
                        </td>
                        <td className="p-4 text-wed-brown-light">{account.email}</td>
                        <td className="p-4 text-wed-brown-light">{account.phone || 'N/A'}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              account.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : account.role === 'vendor'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {account.role}
                          </span>
                        </td>
                        <td className="p-4 text-wed-brown-muted">
                          {account.createdAt ? formatDate(account.createdAt) : 'N/A'}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={isActive ? 'active' : 'inactive'} />
                        </td>
                        <td className="p-4 text-right">
                          {account.role !== 'admin' && (
                            <button
                              disabled={togglingId === userId}
                              onClick={() => handleToggleStatus(userId, isActive)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                isActive
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              } disabled:opacity-50`}
                            >
                              {isActive ? (
                                <>
                                  <UserX className="w-3.5 h-3.5" />
                                  Suspend
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Activate
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-wed-brown-muted">
                      No user accounts found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
