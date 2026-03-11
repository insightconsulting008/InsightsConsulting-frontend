import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "@src/providers/axiosInstance";
import {
  Package,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Eye,
  Layers,
  Hash,
  ChevronRight,
  UserCheck,
  X,
  Filter,
  MessageSquare,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function MyService() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

   // Hardcoded user ID as requested
  const employeeId = localStorage.getItem("employeeId");

if (!employeeId) {
  console.error("Employee ID not found");
}

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`staff/${employeeId}/applications/`);
      if (response.data.success) {
        setApplications(response.data.applications);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return { 
          bg: 'bg-primary-50',
          text: 'text-primary-800',
          border: 'border-primary-200',
          icon: UserCheck,
          iconColor: 'text-primary',
          label: 'Assigned'
        };
      case 'IN_PROGRESS':
        return { 
          bg: 'bg-warning-50',
          text: 'text-warning-800',
          border: 'border-warning-200',
          icon: RefreshCw,
          iconColor: 'text-warning-600',
          label: 'In Progress'
        };
      case 'COMPLETED':
        return { 
          bg: 'bg-success-50',
          text: 'text-success-800',
          border: 'border-success-200',
          icon: CheckCircle,
          iconColor: 'text-success-600',
          label: 'Completed'
        };
      case 'PENDING':
        return { 
          bg: 'bg-neutral-100',
          text: 'text-neutral-800',
          border: 'border-neutral-200',
          icon: Clock,
          iconColor: 'text-neutral-600',
          label: 'Pending'
        };
      default:
        return { 
          bg: 'bg-neutral-100',
          text: 'text-neutral-800',
          border: 'border-neutral-200',
          icon: AlertCircle,
          iconColor: 'text-neutral-600',
          label: status
        };
    }
  };

  const getServiceTypeConfig = (type) => {
    switch (type) {
      case 'RECURRING':
        return {
          bg: 'bg-primary-50',
          text: 'text-primary-800',
          border: 'border-primary-200',
          label: 'Recurring'
        };
      case 'ONE_TIME':
        return {
          bg: 'bg-info-50',
          text: 'text-info-800',
          border: 'border-info-200',
          label: 'One Time'
        };
      default:
        return {
          bg: 'bg-neutral-100',
          text: 'text-neutral-800',
          border: 'border-neutral-200',
          label: type
        };
    }
  };

  const handleViewDetails = (applicationId) => {
    navigate(`/tasks/${applicationId}`);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-200 border-t-primary mb-4"></div>
          <p className="text-neutral-600 text-lg font-medium">Loading your services...</p>
          <p className="text-neutral-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-error-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Error Loading Data</h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button
            onClick={fetchApplications}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Package className="text-primary" size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">My Services</h1>
                <p className="text-neutral-500 text-sm sm:text-base">Manage and track all your assigned service applications</p>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Total Services */}
            <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Total Services</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900">{applications.length}</h3>
                  <p className="text-xs text-neutral-400 mt-2">All assigned services</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Package className="text-primary" size={28} />
                </div>
              </div>
            </div>

            {/* Assigned Services */}
            <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Assigned</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                    {applications.filter(app => app.status === 'ASSIGNED').length}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2">Currently assigned</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <UserCheck className="text-primary" size={28} />
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">In Progress</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                    {applications.filter(app => app.status === 'IN_PROGRESS').length}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2">Currently in progress</p>
                </div>
                <div className="p-3 bg-warning-50 rounded-lg">
                  <RefreshCw className="text-warning-600" size={28} />
                </div>
              </div>
            </div>

            {/* Recurring Services */}
            <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Recurring</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                    {applications.filter(app => app.serviceType === 'RECURRING').length}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2">Monthly/Yearly services</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Layers className="text-primary" size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-md">
            {/* Search and Filters */}
            <div className="px-4 sm:px-6 pt-6">
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setStatusFilter('All')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    statusFilter === 'All' 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-primary hover:text-primary"
                  }`}
                >
                  All Services ({applications.length})
                </button>
                <button
                  onClick={() => setStatusFilter('ASSIGNED')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    statusFilter === 'ASSIGNED' 
                      ? 'bg-primary-50 text-primary-800 border-primary-300' 
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-primary hover:text-primary"
                  }`}
                >
                  Assigned ({applications.filter(app => app.status === 'ASSIGNED').length})
                </button>
                <button
                  onClick={() => setStatusFilter('IN_PROGRESS')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    statusFilter === 'IN_PROGRESS' 
                      ? 'bg-warning-50 text-warning-800 border-warning-300' 
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-primary hover:text-primary"
                  }`}
                >
                  In Progress ({applications.filter(app => app.status === 'IN_PROGRESS').length})
                </button>
                <button
                  onClick={() => setStatusFilter('COMPLETED')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    statusFilter === 'COMPLETED' 
                      ? 'bg-success-50 text-success-800 border-success-300' 
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-primary hover:text-primary"
                  }`}
                >
                  Completed ({applications.filter(app => app.status === 'COMPLETED').length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 z-10" size={20} />
                    <input
                      type="text"
                      placeholder="Search services by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-neutral-300 bg-white text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-80 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Services List */}
            <div className="px-4 sm:px-6 pb-6">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12 sm:py-24 bg-neutral-50 rounded-lg border border-neutral-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-neutral-100 mb-6">
                    <Search className="text-neutral-400" size={32} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">No services found</h3>
                  <p className="text-neutral-500 max-w-md mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
                    {searchTerm || statusFilter !== 'All' 
                      ? "No services match your current search criteria." 
                      : "No services available at the moment."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {searchTerm || statusFilter !== 'All' ? (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("All");
                        }}
                        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
                      >
                        <Filter size={18} />
                        Clear All Filters
                      </button>
                    ) : null}
                    
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApplications.map((app) => {
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;
                    const serviceTypeConfig = getServiceTypeConfig(app.serviceType);
                    
                    return (
                      <div key={app.applicationId} className="bg-white border border-neutral-200 rounded-xl px-4 py-4 sm:px-6 hover:border-primary-200 hover:shadow-sm transition-all">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 items-start sm:items-center gap-4 md:gap-6">
                          
                          {/* ICON + SERVICE NAME */}
                          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-neutral-900 text-sm sm:text-base truncate">
                                {app.serviceName}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${serviceTypeConfig.bg} ${serviceTypeConfig.text} border ${serviceTypeConfig.border}`}>
                                  {serviceTypeConfig.label}
                                </div>
                                {app.totalPeriods > 0 && (
                                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-primary-50 text-primary-800 border border-primary-200">
                                    <Layers size={10} />
                                    {app.totalPeriods} periods
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* APPLICATION ID */}
                          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                            <p className="text-xs text-neutral-400 mb-1">Application ID</p>
                            <p className="font-medium text-neutral-900 text-sm truncate" title={app.applicationId}>
                              <span className="hidden sm:inline">{app.applicationId}</span>
                              <span className="sm:hidden">{app.applicationId.slice(0, 8)}...</span>
                            </p>
                          </div>

                          {/* STATUS */}
                          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                            <p className="text-xs text-neutral-400 mb-1">Status</p>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${statusConfig.border} ${statusConfig.bg}`}>
                              <StatusIcon size={14} className={statusConfig.iconColor} />
                              <span className={`text-xs font-semibold ${statusConfig.text}`}>
                                {statusConfig.label}
                              </span>
                            </div>
                          </div>

                          {/* DATE */}
                          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                            <p className="text-xs text-neutral-400 mb-1">Created Date</p>
                            <p className="font-medium text-neutral-900 text-sm">
                              {formatDate(app.createdAt)}
                            </p>
                          </div>

                          {/* ACTIONS */}
                          <div className="col-span-1 sm:col-span-2 lg:col-span-2 lg:justify-self-end">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => handleViewDetails(app.applicationId)}
                                className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition whitespace-nowrap flex items-center justify-center gap-2 shadow-sm"
                              >
                                <Eye size={16} />
                                View Details
                              </button>
                              <button
                                onClick={() => window.open(`/tasks/${app.applicationId}`, '_blank')}
                                className="w-full sm:w-auto px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition whitespace-nowrap flex items-center justify-center gap-2"
                              >
                                <ExternalLink size={16} />
                                New Tab
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}