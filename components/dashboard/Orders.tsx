import React, { useEffect, useMemo, useState } from 'react';
import { DashboardOrder, DashboardOrderStatus } from '../../src/types/dashboard';
import { orderService } from '../../src/services/orderService';
import { ApiError } from '../../src/services/api';

const STATUS_LABELS: Record<DashboardOrderStatus, string> = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Selesai',
    cancelled: 'Dibatalkan',
};

const STATUS_COLORS: Record<DashboardOrderStatus, string> = {
    pending: 'bg-gray-100 text-gray-700',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const AVAILABLE_STATUSES: DashboardOrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<DashboardOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<DashboardOrderStatus | 'all'>('all');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [submittingOrderId, setSubmittingOrderId] = useState<string | null>(null);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await orderService.getOrders({ role: 'seller' });
            setOrders(data);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Gagal memuat pesanan.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            if (filterStatus !== 'all' && order.status !== filterStatus) {
                return false;
            }

            if (filterStartDate || filterEndDate) {
                const orderDate = new Date(order.createdAt);
                if (filterStartDate && orderDate < new Date(filterStartDate)) {
                    return false;
                }
                if (filterEndDate) {
                    const endDate = new Date(filterEndDate);
                    endDate.setDate(endDate.getDate() + 1);
                    if (orderDate >= endDate) {
                        return false;
                    }
                }
            }

            return true;
        });
    }, [orders, filterStatus, filterStartDate, filterEndDate]);

    const handleResetFilters = () => {
        setFilterStatus('all');
        setFilterStartDate('');
        setFilterEndDate('');
    };

    const handleStatusUpdate = async (order: DashboardOrder, status: DashboardOrderStatus) => {
        if (order.status === status) {
            return;
        }

        try {
            setSubmittingOrderId(order.id);
            const updatedOrder = await orderService.updateStatus(order.id, status);
            setOrders(prev => prev.map(item => (item.id === updatedOrder.id ? updatedOrder : item)));
            setError(null);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Gagal memperbarui status pesanan.';
            setError(message);
        } finally {
            setSubmittingOrderId(null);
        }
    };

    const totalRevenue = useMemo(
        () => filteredOrders.reduce((acc, order) => acc + order.totalAmount, 0),
        [filteredOrders]
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border animate-fade-in">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Pesanan Saya</h2>
                    <p className="text-sm text-gray-500">Pantau dan ubah status pesanan pelanggan secara real-time.</p>
                </div>
                <div className="rounded-lg border bg-gray-50 p-4 text-right">
                    <p className="text-xs text-gray-500">Total Pendapatan Terfilter</p>
                    <p className="text-lg font-semibold text-gray-800">{formatCurrency(totalRevenue)}</p>
                </div>
            </div>

            <div className="mb-6 mt-6 space-y-4 rounded-lg border bg-gray-50 p-4 md:flex md:items-end md:space-y-0 md:space-x-4">
                <div className="flex-1">
                    <label htmlFor="status-filter" className="mb-1 block text-sm font-medium text-gray-700">Filter Status</label>
                    <select
                        id="status-filter"
                        value={filterStatus}
                        onChange={event => setFilterStatus(event.target.value as DashboardOrderStatus | 'all')}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">Semua Status</option>
                        {AVAILABLE_STATUSES.map(status => (
                            <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="start-date" className="mb-1 block text-sm font-medium text-gray-700">Dari Tanggal</label>
                    <input
                        type="date"
                        id="start-date"
                        value={filterStartDate}
                        onChange={event => setFilterStartDate(event.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="end-date" className="mb-1 block text-sm font-medium text-gray-700">Sampai Tanggal</label>
                    <input
                        type="date"
                        id="end-date"
                        value={filterEndDate}
                        onChange={event => setFilterEndDate(event.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleResetFilters}
                    className="w-full flex-shrink-0 rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-300 md:w-auto"
                >
                    Reset Filter
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No. Pesanan</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tanggal</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Pelanggan</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {loading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Memuat pesanan...</td>
                            </tr>
                        )}
                        {!loading && filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    <div className="flex flex-col items-center space-y-2">
                                        <span className="material-symbols-outlined text-4xl text-gray-300">receipt_long_off</span>
                                        <p className="font-semibold">Belum ada pesanan sesuai filter</p>
                                        <p className="text-sm">Gunakan rentang tanggal atau status lain untuk melihat pesanan.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!loading && filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{order.orderNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(order.createdAt).toLocaleString('id-ID')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customerName || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                                        {STATUS_LABELS[order.status]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <div className="flex items-center justify-end space-x-2">
                                        <select
                                            value={order.status}
                                            onChange={event => handleStatusUpdate(order, event.target.value as DashboardOrderStatus)}
                                            disabled={submittingOrderId === order.id}
                                            className="rounded-md border border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed"
                                        >
                                            {AVAILABLE_STATUSES.map(status => (
                                                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                                            ))}
                                        </select>
                                        <button
                                            className="text-blue-600 hover:text-blue-900"
                                            onClick={() => alert('Detail pesanan coming soon')}
                                        >
                                            Detail
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;