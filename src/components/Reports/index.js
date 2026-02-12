import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Card, Row, Col, Form, Button, Table } from "react-bootstrap";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

// Lazy import for ApexCharts (replaces next/dynamic)
const Chart = lazy(() => import("react-apexcharts"));

const Reports = () => {
    const { isSuperAdmin, companyId } = useAuth();
    const reportRef = useRef(null);

    // Selected time period
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    // Calculate dates based on selected period
    const getDateRange = (period) => {
        const endDate = new Date();
        const startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case '3months':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(startDate.getMonth() - 1);
        }

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    };

    const { startDate, endDate } = getDateRange(selectedPeriod);

    // Get period label for display
    const getPeriodLabel = (period) => {
        switch (period) {
            case 'week': return 'Last Week';
            case 'month': return 'Last Month';
            case '3months': return 'Last 3 Months';
            case 'year': return 'Last Year';
            default: return 'Last Month';
        }
    };

    // State for data
    const [isLoading, setIsLoading] = useState(true);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [sickNotesCount, setSickNotesCount] = useState(0);
    const [companiesCount, setCompaniesCount] = useState(0);
    const [monthlyData, setMonthlyData] = useState([]);
    const [statusData, setStatusData] = useState({ pending: 0, approved: 0, rejected: 0 });
    const [topEmployees, setTopEmployees] = useState([]);

    // PDF generation state
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Fetch report data function
    const fetchReportData = async (showLoading = true) => {
        try {
            if (showLoading) {
                setIsLoading(true);
            }

            // Fetch employees count
            let employeesQuery = supabase.from('employees').select('id', { count: 'exact' });
            if (!isSuperAdmin && companyId) {
                employeesQuery = employeesQuery.eq('company_id', companyId);
            }
            const { count: empCount } = await employeesQuery;
            setEmployeeCount(empCount || 0);

            // Fetch companies count (only for super admin)
            if (isSuperAdmin) {
                const { count: compCount } = await supabase
                    .from('companies')
                    .select('id', { count: 'exact' })
                    .eq('is_active', true);
                setCompaniesCount(compCount || 0);
            }

            // Fetch sick notes within date range
            let sickNotesQuery = supabase
                .from('sick_notes')
                .select('*, employees(employee_id, name)')
                .gte('start_date', startDate)
                .lte('start_date', endDate);

            if (!isSuperAdmin && companyId) {
                sickNotesQuery = sickNotesQuery.eq('company_id', companyId);
            }

            const { data: sickNotes, error } = await sickNotesQuery;

            if (error) {
                console.error('Error fetching sick notes:', error);
                return;
            }

            setSickNotesCount(sickNotes?.length || 0);

            // Calculate status distribution
            const statusCounts = { pending: 0, approved: 0, rejected: 0 };
            sickNotes?.forEach(note => {
                const status = (note.status || 'pending').toLowerCase();
                if (statusCounts[status] !== undefined) {
                    statusCounts[status]++;
                }
            });
            setStatusData(statusCounts);

            // Calculate monthly distribution
            const monthlyMap = {};
            sickNotes?.forEach(note => {
                const date = new Date(note.start_date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;
            });

            // Convert to sorted array
            const monthlyArray = Object.entries(monthlyMap)
                .map(([month, count]) => ({ month, count }))
                .sort((a, b) => a.month.localeCompare(b.month));
            setMonthlyData(monthlyArray);

            // Calculate top employees by sick notes
            const employeeMap = {};
            sickNotes?.forEach(note => {
                const empId = note.employee_id;
                const empName = note.employees?.name || note.employees?.employee_id || 'Unknown';
                if (!employeeMap[empId]) {
                    employeeMap[empId] = { name: empName, count: 0 };
                }
                employeeMap[empId].count++;
            });

            const topEmp = Object.entries(employeeMap)
                .map(([id, data]) => ({ id, ...data }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);
            setTopEmployees(topEmp);

        } catch (err) {
            console.error('Error fetching report data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch when dependencies change
    useEffect(() => {
        fetchReportData(true);
    }, [selectedPeriod, isSuperAdmin, companyId]);

    // Auto-refresh every 60 seconds (without showing loading spinner)
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            fetchReportData(false); // Don't show loading on auto-refresh
        }, 60000);

        // Cleanup interval on unmount
        return () => clearInterval(refreshInterval);
    }, [selectedPeriod, isSuperAdmin, companyId]);

    // Chart options for monthly sick notes
    const monthlyChartOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'Inter, sans-serif'
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '60%'
            }
        },
        colors: ['#605DFF'],
        xaxis: {
            categories: monthlyData.map(d => {
                const [year, month] = d.month.split('-');
                return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            }),
            labels: { style: { fontSize: '11px' } }
        },
        yaxis: {
            labels: { style: { fontSize: '11px' } }
        },
        dataLabels: { enabled: false },
        grid: { borderColor: '#f0f0f0' }
    };

    const monthlyChartSeries = [{
        name: 'Sick Notes',
        data: monthlyData.map(d => d.count)
    }];

    // Chart options for status distribution
    const statusChartOptions = {
        chart: {
            type: 'donut',
            fontFamily: 'Inter, sans-serif'
        },
        labels: ['Pending', 'Approved', 'Rejected'],
        colors: ['#f59e0b', '#22c55e', '#ef4444'],
        legend: {
            position: 'bottom',
            fontSize: '12px'
        },
        dataLabels: {
            enabled: true,
            style: { fontSize: '12px' }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontWeight: 600
                        }
                    }
                }
            }
        }
    };

    const statusChartSeries = [statusData.pending, statusData.approved, statusData.rejected];

    // Generate PDF report
    const generatePDF = async () => {
        setIsGeneratingPDF(true);

        try {
            // Import jsPDF
            const jsPDFModule = await import('jspdf');
            const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

            // Import and apply autoTable plugin
            const autoTableModule = await import('jspdf-autotable');
            const autoTable = autoTableModule.default || autoTableModule;

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // Title
            doc.setFontSize(20);
            doc.setTextColor(60, 60, 60);
            doc.text('HR System Report', pageWidth / 2, 20, { align: 'center' });

            // Period info
            doc.setFontSize(12);
            doc.setTextColor(80, 80, 80);
            doc.text(`Period: ${getPeriodLabel(selectedPeriod)}`, pageWidth / 2, 28, { align: 'center' });

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`(${startDate} to ${endDate})`, pageWidth / 2, 34, { align: 'center' });
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 40, { align: 'center' });

            let yPos = 52;

            // Summary section - always included
            doc.setFontSize(14);
            doc.setTextColor(60, 60, 60);
            doc.text('Summary Statistics', 14, yPos);
            yPos += 10;

            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            if (isSuperAdmin) {
                doc.text(`Total Companies: ${companiesCount}`, 20, yPos);
                yPos += 7;
            }
            doc.text(`Total Employees: ${employeeCount}`, 20, yPos);
            yPos += 7;
            doc.text(`Total Sick Notes (${getPeriodLabel(selectedPeriod)}): ${sickNotesCount}`, 20, yPos);
            yPos += 7;
            doc.text(`Status Breakdown:`, 20, yPos);
            yPos += 6;
            doc.text(`   - Pending: ${statusData.pending}`, 20, yPos);
            yPos += 6;
            doc.text(`   - Approved: ${statusData.approved}`, 20, yPos);
            yPos += 6;
            doc.text(`   - Rejected: ${statusData.rejected}`, 20, yPos);
            yPos += 15;

            // Monthly breakdown
            if (monthlyData.length > 0) {
                doc.setFontSize(14);
                doc.setTextColor(60, 60, 60);
                doc.text('Monthly Sick Notes Breakdown', 14, yPos);
                yPos += 5;

                const monthlyTableData = monthlyData.map(d => {
                    const [year, month] = d.month.split('-');
                    const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    return [monthName, d.count.toString()];
                });

                autoTable(doc, {
                    startY: yPos,
                    head: [['Month', 'Sick Notes']],
                    body: monthlyTableData,
                    theme: 'striped',
                    headStyles: { fillColor: [96, 93, 255] },
                    styles: { fontSize: 10 }
                });

                yPos = doc.lastAutoTable.finalY + 15;
            }

            // Top employees
            if (topEmployees.length > 0) {
                // Check if we need a new page
                if (yPos > 200) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFontSize(14);
                doc.setTextColor(60, 60, 60);
                doc.text('Top Employees by Sick Notes', 14, yPos);
                yPos += 5;

                const employeeTableData = topEmployees.map((emp, idx) => [
                    (idx + 1).toString(),
                    emp.name,
                    emp.count.toString()
                ]);

                autoTable(doc, {
                    startY: yPos,
                    head: [['Rank', 'Employee', 'Sick Notes']],
                    body: employeeTableData,
                    theme: 'striped',
                    headStyles: { fillColor: [96, 93, 255] },
                    styles: { fontSize: 10 }
                });
            }

            // Save the PDF
            const fileName = `hr_report_${getPeriodLabel(selectedPeriod).replace(/\s/g, '_')}_${startDate}_to_${endDate}.pdf`;
            doc.save(fileName);

        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('Failed to generate PDF: ' + (err.message || 'Unknown error'));
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <span className="text-muted">Loading report data...</span>
            </div>
        );
    }

    return (
        <>
            <div ref={reportRef}>
                {/* Filters Section */}
                <Card className="bg-white border-0 rounded-3 mb-4">
                    <Card.Body className="p-4">
                        <Row className="align-items-end">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label style={{ fontSize: '12px', fontWeight: '600' }}>Select Period</Form.Label>
                                    <Form.Select
                                        value={selectedPeriod}
                                        onChange={(e) => setSelectedPeriod(e.target.value)}
                                        style={{ fontSize: '12px' }}
                                    >
                                        <option value="week">Last Week</option>
                                        <option value="month">Last Month</option>
                                        <option value="3months">Last 3 Months</option>
                                        <option value="year">Last Year</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                    <strong>Date Range:</strong> {startDate} to {endDate}
                                </div>
                            </Col>
                            <Col md={4}>
                                <Button
                                    variant="primary"
                                    onClick={generatePDF}
                                    disabled={isGeneratingPDF}
                                    className="w-100"
                                    style={{ fontSize: '12px' }}
                                >
                                    {isGeneratingPDF ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-download-line me-1"></i>
                                            Download PDF Report
                                        </>
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Summary Stats */}
                <Row className="mb-4">
                    {isSuperAdmin && (
                        <Col md={4}>
                            <Card className="bg-white border-0 rounded-3 h-100">
                                <Card.Body className="p-4 text-center">
                                    <div
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                        style={{ width: '60px', height: '60px', backgroundColor: '#605DFF20' }}
                                    >
                                        <i className="material-symbols-outlined" style={{ fontSize: '28px', color: '#605DFF' }}>business</i>
                                    </div>
                                    <h2 className="mb-1" style={{ fontSize: '28px', fontWeight: '700', color: '#333' }}>{companiesCount}</h2>
                                    <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>Total Companies</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                    <Col md={isSuperAdmin ? 4 : 6}>
                        <Card className="bg-white border-0 rounded-3 h-100">
                            <Card.Body className="p-4 text-center">
                                <div
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                    style={{ width: '60px', height: '60px', backgroundColor: '#22c55e20' }}
                                >
                                    <i className="material-symbols-outlined" style={{ fontSize: '28px', color: '#22c55e' }}>groups</i>
                                </div>
                                <h2 className="mb-1" style={{ fontSize: '28px', fontWeight: '700', color: '#333' }}>{employeeCount}</h2>
                                <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>Total Employees</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={isSuperAdmin ? 4 : 6}>
                        <Card className="bg-white border-0 rounded-3 h-100">
                            <Card.Body className="p-4 text-center">
                                <div
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                    style={{ width: '60px', height: '60px', backgroundColor: '#f59e0b20' }}
                                >
                                    <i className="material-symbols-outlined" style={{ fontSize: '28px', color: '#f59e0b' }}>medical_services</i>
                                </div>
                                <h2 className="mb-1" style={{ fontSize: '28px', fontWeight: '700', color: '#333' }}>{sickNotesCount}</h2>
                                <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>Sick Notes (Period)</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Charts Section */}
                <Row className="mb-4">
                    <Col lg={8}>
                        <Card className="bg-white border-0 rounded-3 h-100">
                            <Card.Body className="p-4">
                                <h6 className="mb-3" style={{ fontSize: '14px', fontWeight: '600' }}>Monthly Sick Notes Trend</h6>
                                {monthlyData.length > 0 ? (
                                    <Chart
                                        options={monthlyChartOptions}
                                        series={monthlyChartSeries}
                                        type="bar"
                                        height={300}
                                    />
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        No data available for the selected period
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card className="bg-white border-0 rounded-3 h-100">
                            <Card.Body className="p-4">
                                <h6 className="mb-3" style={{ fontSize: '14px', fontWeight: '600' }}>Status Distribution</h6>
                                {sickNotesCount > 0 ? (
                                    <Chart
                                        options={statusChartOptions}
                                        series={statusChartSeries}
                                        type="donut"
                                        height={300}
                                    />
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        No data available
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row >

                {/* Top Employees Table */}
                < Card className="bg-white border-0 rounded-3 mb-4" >
                    <Card.Body className="p-4">
                        <h6 className="mb-3" style={{ fontSize: '14px', fontWeight: '600' }}>Top Employees by Sick Notes</h6>
                        {topEmployees.length > 0 ? (
                            <Table responsive hover style={{ fontSize: '12px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '60px' }}>Rank</th>
                                        <th>Employee</th>
                                        <th style={{ width: '120px' }}>Sick Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topEmployees.map((emp, index) => (
                                        <tr key={emp.id}>
                                            <td>
                                                <span
                                                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#f0f0f0',
                                                        color: index < 3 ? '#fff' : '#64748B',
                                                        fontSize: '10px',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td>{emp.name}</td>
                                            <td>
                                                <span className="badge bg-primary bg-opacity-10 text-primary">
                                                    {emp.count} {emp.count === 1 ? 'note' : 'notes'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center py-4 text-muted">
                                No employee data available for the selected period
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default Reports;
