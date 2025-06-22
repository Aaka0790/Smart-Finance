// Spending Categories Dashboard JavaScript
class SpendingCategoriesChart {
    constructor() {
        this.chart = null;
        this.currentPeriod = 'week';
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        
        // Sample data - replace with your actual data source
        this.data = {
            week: {
                labels: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare'],
                amounts: [450, 180, 320, 120, 280, 90],
                transactions: [12, 8, 5, 3, 4, 2]
            },
            month: {
                labels: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Travel', 'Education'],
                amounts: [1850, 720, 1240, 480, 1120, 360, 890, 210],
                transactions: [48, 32, 18, 12, 16, 8, 6, 3]
            },
            year: {
                labels: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Travel', 'Education', 'Insurance', 'Investments'],
                amounts: [22200, 8640, 14880, 5760, 13440, 4320, 10680, 2520, 7200, 15600],
                transactions: [576, 384, 216, 144, 192, 96, 72, 36, 48, 60]
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createChart();
        this.updateLegend();
    }
    
    setupEventListeners() {
        // Time period selector buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active button
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update period and refresh chart
                this.currentPeriod = e.target.dataset.period;
                this.updateChart();
                this.updateLegend();
            });
        });
    }
    
    createChart() {
        const ctx = document.getElementById('categoryChartBar');
        if (!ctx) return;
        
        const currentData = this.data[this.currentPeriod];
        
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: currentData.labels,
                datasets: [{
                    label: 'Amount Spent',
                    data: currentData.amounts,
                    backgroundColor: this.colors.slice(0, currentData.labels.length),
                    borderColor: this.colors.slice(0, currentData.labels.length),
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // We'll use custom legend
                    },
                    tooltip: {
                        enabled: false, // We'll use custom tooltip
                        external: (context) => this.customTooltip(context)
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#888',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#888',
                            font: {
                                size: 12
                            },
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                },
                onHover: (event, activeElements) => {
                    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                },
                onClick: (event, activeElements) => {
                    if (activeElements.length > 0) {
                        const index = activeElements[0].index;
                        this.onCategoryClick(index);
                    }
                }
            }
        });
    }
    
    updateChart() {
        if (!this.chart) return;
        
        const currentData = this.data[this.currentPeriod];
        
        this.chart.data.labels = currentData.labels;
        this.chart.data.datasets[0].data = currentData.amounts;
        this.chart.data.datasets[0].backgroundColor = this.colors.slice(0, currentData.labels.length);
        this.chart.data.datasets[0].borderColor = this.colors.slice(0, currentData.labels.length);
        
        this.chart.update('active');
    }
    
    customTooltip(context) {
        const tooltip = document.getElementById('chartTooltip');
        const overlay = document.getElementById('chartOverlay');
        
        if (!tooltip || !overlay) return;
        
        if (context.tooltip.opacity === 0) {
            tooltip.style.opacity = '0';
            return;
        }
        
        const dataIndex = context.tooltip.dataPoints[0].dataIndex;
        const currentData = this.data[this.currentPeriod];
        const amount = currentData.amounts[dataIndex];
        const transactions = currentData.transactions[dataIndex];
        const category = currentData.labels[dataIndex];
        
        tooltip.innerHTML = `
            <div class="tooltip-header">${category}</div>
            <div class="tooltip-content">
                <div class="tooltip-item">
                    <span class="tooltip-label">Amount:</span>
                    <span class="tooltip-value">$${amount.toLocaleString()}</span>
                </div>
                <div class="tooltip-item">
                    <span class="tooltip-label">Transactions:</span>
                    <span class="tooltip-value">${transactions}</span>
                </div>
                <div class="tooltip-item">
                    <span class="tooltip-label">Avg per transaction:</span>
                    <span class="tooltip-value">$${Math.round(amount / transactions).toLocaleString()}</span>
                </div>
            </div>
        `;
        
        const position = Chart.helpers.getRelativePosition(context.chart.canvas, context.tooltip);
        tooltip.style.opacity = '1';
        tooltip.style.left = position.x + 'px';
        tooltip.style.top = position.y + 'px';
    }
    
    updateLegend() {
        const legendContainer = document.getElementById('categoryLegend');
        if (!legendContainer) return;
        
        const currentData = this.data[this.currentPeriod];
        const total = currentData.amounts.reduce((sum, amount) => sum + amount, 0);
        
        legendContainer.innerHTML = currentData.labels.map((label, index) => {
            const amount = currentData.amounts[index];
            const percentage = ((amount / total) * 100).toFixed(1);
            const color = this.colors[index];
            
            return `
                <div class="legend-item" data-index="${index}">
                    <div class="legend-color" style="background-color: ${color}"></div>
                    <div class="legend-content">
                        <div class="legend-label">${label}</div>
                        <div class="legend-values">
                            <span class="legend-amount">$${amount.toLocaleString()}</span>
                            <span class="legend-percentage">${percentage}%</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click handlers to legend items
        legendContainer.querySelectorAll('.legend-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.toggleCategory(index);
            });
        });
    }
    
    toggleCategory(index) {
        const meta = this.chart.getDatasetMeta(0);
        meta.data[index].hidden = !meta.data[index].hidden;
        this.chart.update();
        
        // Update legend item appearance
        const legendItem = document.querySelector(`[data-index="${index}"]`);
        if (legendItem) {
            legendItem.classList.toggle('hidden');
        }
    }
    
    onCategoryClick(index) {
        const currentData = this.data[this.currentPeriod];
        const category = currentData.labels[index];
        
        // You can implement navigation to detailed view here
        console.log(`Clicked on category: ${category}`);
        
        // Example: Show detailed breakdown (implement as needed)
        this.showCategoryDetails(category, index);
    }
    
    showCategoryDetails(category, index) {
        // Placeholder for detailed view - implement based on your needs
        const currentData = this.data[this.currentPeriod];
        const amount = currentData.amounts[index];
        const transactions = currentData.transactions[index];
        
        // You could show a modal, navigate to another page, etc.
        alert(`${category} Details:\nTotal: $${amount.toLocaleString()}\nTransactions: ${transactions}\nAverage: $${Math.round(amount / transactions)}`);
    }
    
    // Method to update data (call this when new data is available)
    updateData(newData) {
        this.data = { ...this.data, ...newData };
        this.updateChart();
        this.updateLegend();
    }
    
    // Method to get current data for external use
    getCurrentData() {
        return this.data[this.currentPeriod];
    }
    
    // Destroy chart (cleanup)
    destroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}

// CSS styles for tooltips and legend (add to your stylesheet)
const styles = `
.chart-overlay {
    position: relative;
    pointer-events: none;
}

.chart-tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 12px;
    border-radius: 8px;
    font-size: 12px;
    pointer-events: none;
    z-index: 1000;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-width: 200px;
}

.tooltip-header {
    font-weight: bold;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.tooltip-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
}

.tooltip-label {
    color: #ccc;
}

.tooltip-value {
    font-weight: bold;
}

.category-legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-top: 20px;
}

.legend-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.legend-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.legend-item.hidden {
    opacity: 0.5;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 10px;
    flex-shrink: 0;
}

.legend-content {
    flex: 1;
}

.legend-label {
    font-weight: 500;
    margin-bottom: 2px;
}

.legend-values {
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: #888;
}

.legend-amount {
    font-weight: 600;
}

.legend-percentage {
    color: #666;
}
`;

// Add styles to page
if (!document.getElementById('spending-categories-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'spending-categories-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Initialize the chart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Make sure Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is required. Please include it in your HTML.');
        return;
    }
    
    // Initialize the spending categories chart
    window.spendingChart = new SpendingCategoriesChart();
});

// Export for module use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpendingCategoriesChart;
}