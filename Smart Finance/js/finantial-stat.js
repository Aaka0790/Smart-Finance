// Financial Dashboard Stats Cards JavaScript
class FinancialDashboard {
    constructor() {
        this.data = {
            totalBalance: 24580.75,
            monthlyIncome: 8450.00,
            monthlyExpenses: 3250.50,
            savingsRate: 62,
            transactions: [],
            goals: {
                monthlyIncome: 10000,
                monthlyExpenses: 3000,
                savingsRate: 70
            },
            balanceHistory: this.generateBalanceHistory(),
            expenseBreakdown: {
                food: 850,
                transport: 420,
                entertainment: 320,
                shopping: 680,
                bills: 980
            }
        };
        
        this.charts = {};
        this.isBalanceVisible = true;
        this.animationTimers = {};
        
        this.init();
    }

    init() {
        this.updateAllCards();
        this.initEventListeners();
        this.initCharts();
        this.startAutoUpdate();
        this.initAOS();
    }

    // Initialize event listeners
    initEventListeners() {
        // Balance visibility toggle
        const toggleBtn = document.getElementById('toggleBalance');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleBalanceVisibility());
        }

        // Quick action buttons
        const incomeAddBtn = document.querySelector('.income-card .action-btn');
        const expenseAddBtn = document.querySelector('.expense-card .action-btn');
        const savingsGoalBtn = document.querySelector('.savings-card .action-btn');

        if (incomeAddBtn) {
            incomeAddBtn.addEventListener('click', () => this.openTransactionModal('income'));
        }
        if (expenseAddBtn) {
            expenseAddBtn.addEventListener('click', () => this.openTransactionModal('expense'));
        }
        if (savingsGoalBtn) {
            savingsGoalBtn.addEventListener('click', () => this.openGoalModal());
        }

        // Card hover effects
        this.initCardHoverEffects();
    }

    // Initialize AOS (Animate On Scroll) if available
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true
            });
        }
    }

    // Generate sample balance history for chart
    generateBalanceHistory() {
        const history = [];
        let balance = 20000;
        const now = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            // Simulate realistic balance changes
            const change = (Math.random() - 0.4) * 500;
            balance += change;
            
            history.push({
                date: date.toISOString().split('T')[0],
                balance: Math.max(balance, 1000) // Ensure balance doesn't go too low
            });
        }
        
        return history;
    }

    // Update all stat cards
    updateAllCards() {
        this.updateBalanceCard();
        this.updateIncomeCard();
        this.updateExpenseCard();
        this.updateSavingsCard();
    }

    // Update balance card
    updateBalanceCard() {
        const balanceElement = document.getElementById('totalBalance');
        const trendElement = document.getElementById('balanceTrend');
        
        if (balanceElement) {
            if (this.isBalanceVisible) {
                this.animateValue(balanceElement, this.data.totalBalance);
            } else {
                balanceElement.textContent = '••••••';
            }
        }

        if (trendElement) {
            const trend = this.calculateBalanceTrend();
            trendElement.innerHTML = `${trend.icon} ${trend.text}`;
            trendElement.className = `trend-text ${trend.class}`;
        }
    }

    // Update income card
    updateIncomeCard() {
        const incomeElement = document.getElementById('monthlyIncome');
        const trendElement = document.getElementById('incomeTrend');
        const progressElement = document.getElementById('incomeProgress');
        const progressTextElement = document.getElementById('incomeProgressText');

        if (incomeElement) {
            this.animateValue(incomeElement, this.data.monthlyIncome);
        }

        if (trendElement) {
            const trend = this.calculateIncomeTrend();
            trendElement.innerHTML = `${trend.icon} ${trend.text}`;
            trendElement.className = `trend-text ${trend.class}`;
        }
        function updateIncomeProgress(income) {
    const goal = 10000;
    const progress = Math.min((income / goal) * 100, 100);
    const progressBar = document.getElementById('incomeProgress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Update Savings Ring
function updateSavingsRing(percentage) {
    const circle = document.querySelector('.progress-ring-circle');
    if (circle) {
        const circumference = 2 * Math.PI * 30;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
}

        // Update progress bar
        if (progressElement && progressTextElement) {
            const progress = (this.data.monthlyIncome / this.data.goals.monthlyIncome) * 100;
            progressElement.style.width = Math.min(progress, 100) + '%';
            progressTextElement.textContent = `Goal: $${this.formatNumber(this.data.goals.monthlyIncome)}`;
            
            // Add progress color based on achievement
            progressElement.className = 'progress-fill ' + (progress >= 100 ? 'achieved' : progress >= 80 ? 'near-goal' : '');
        }
    }

    // Update expense card
    updateExpenseCard() {
        const expenseElement = document.getElementById('monthlyExpenses');
        const trendElement = document.getElementById('expenseTrend');
        const breakdownElement = document.getElementById('expenseBreakdown');

        if (expenseElement) {
            this.animateValue(expenseElement, this.data.monthlyExpenses);
        }

        if (trendElement) {
            const trend = this.calculateExpenseTrend();
            trendElement.innerHTML = `${trend.icon} ${trend.text}`;
            trendElement.className = `trend-text ${trend.class}`;
        }

        // Update expense breakdown
        if (breakdownElement) {
            this.updateExpenseBreakdown(breakdownElement);
        }
    }

    // Update savings card
    updateSavingsCard() {
        const savingsRateElement = document.getElementById('savingsRate');
        const ringValueElement = document.getElementById('ringValue');
        const progressCircle = document.querySelector('.progress-ring-circle');

        if (savingsRateElement) {
            this.animateValue(savingsRateElement, this.data.savingsRate, '', '%');
        }

        if (ringValueElement) {
            ringValueElement.textContent = this.data.savingsRate + '%';
        }

        // Update progress ring
        if (progressCircle) {
            const circumference = 2 * Math.PI * 30; // r = 30
            const progress = (this.data.savingsRate / 100) * circumference;
            const offset = circumference - progress;
            
            progressCircle.style.strokeDashoffset = offset;
            
            // Add color based on savings rate
            const colorClass = this.data.savingsRate >= 70 ? 'high-savings' : 
                             this.data.savingsRate >= 50 ? 'medium-savings' : 'low-savings';
         const someSvgElement = document.getElementById("savings-progress-ring");
if (someSvgElement) {
  someSvgElement.setAttribute("class", `progress-ring-circle ${colorClass}`);
}

        }
    }

    // Update expense breakdown mini chart
    updateExpenseBreakdown(container) {
        const total = Object.values(this.data.expenseBreakdown).reduce((sum, val) => sum + val, 0);
        
        container.innerHTML = Object.entries(this.data.expenseBreakdown)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([category, amount]) => {
                const percentage = (amount / total * 100).toFixed(1);
                return `
                    <div class="expense-item">
                        <div class="expense-bar">
                            <div class="expense-fill" style="width: ${percentage}%"></div>
                        </div>
                        <span class="expense-label">${this.getCategoryIcon(category)} ${percentage}%</span>
                    </div>
                `;
            }).join('');
    }

    // Get category icon
    getCategoryIcon(category) {
        const icons = {
            food: '🍕',
            transport: '🚗',
            entertainment: '🎬',
            shopping: '🛍️',
            bills: '📋'
        };
        return icons[category] || '📦';
    }

    // Initialize charts
    initCharts() {
        this.initBalanceChart();
    }

    // Initialize balance chart
    initBalanceChart() {
        const canvas = document.getElementById('balanceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const history = this.data.balanceHistory.slice(-7); // Last 7 days
        
        this.drawSparklineChart(ctx, history, canvas.width, canvas.height);
    }

    // Draw sparkline chart
    drawSparklineChart(ctx, data, width, height) {
        if (data.length < 2) return;

        const padding = 10;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const minValue = Math.min(...data.map(d => d.balance));
        const maxValue = Math.max(...data.map(d => d.balance));
        const range = maxValue - minValue || 1;

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        data.forEach((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = padding + (1 - (point.balance - minValue) / range) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Add gradient fill
        ctx.globalCompositeOperation = 'destination-over';
        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, 'rgba(74, 222, 128, 0.2)');
        gradient.addColorStop(1, 'rgba(74, 222, 128, 0.05)');
        
        ctx.fillStyle = gradient;
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }

    // Calculate trends
    calculateBalanceTrend() {
        const lastMonth = this.data.totalBalance * 0.89; // Simulated
        const change = ((this.data.totalBalance - lastMonth) / lastMonth * 100).toFixed(1);
        
        return {
            icon: change >= 0 ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>',
            text: `${change >= 0 ? '+' : ''}${change}% from last month`,
            class: change >= 0 ? 'positive' : 'negative'
        };
    }

    calculateIncomeTrend() {
        const change = 5.2; // Simulated
        return {
            icon: '<i class="fas fa-arrow-up"></i>',
            text: `+${change}% this month`,
            class: 'positive'
        };
    }

    calculateExpenseTrend() {
        const change = -8.1; // Simulated
        return {
            icon: '<i class="fas fa-arrow-down"></i>',
            text: `${change}% this month`,
            class: 'negative'
        };
    }

    // Animate number values
    animateValue(element, targetValue, prefix = '', suffix = '') {
        const startValue = parseFloat(element.textContent.replace(/[^\d.-]/g, '')) || 0;
        const duration = 1000;
        const startTime = Date.now();
        const elementId = element.id || Math.random().toString(36).substr(2, 9);

        // Clear existing animation
        if (this.animationTimers[elementId]) {
            clearInterval(this.animationTimers[elementId]);
        }

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easeOutCubic;
            
            if (suffix === '%') {
                element.textContent = Math.round(currentValue);
            } else {
                element.textContent = this.formatNumber(currentValue);
            }
            
            if (progress < 1) {
                this.animationTimers[elementId] = requestAnimationFrame(animate);
            } else {
                delete this.animationTimers[elementId];
            }
        };

        animate();
    }

    // Format numbers with commas
    formatNumber(number) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    // Toggle balance visibility
    toggleBalanceVisibility() {
        this.isBalanceVisible = !this.isBalanceVisible;
        const toggleBtn = document.getElementById('toggleBalance');
        const balanceElement = document.getElementById('totalBalance');
        
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            icon.className = this.isBalanceVisible ? 'fas fa-eye' : 'fas fa-eye-slash';
        }

        this.updateBalanceCard();
    }

    // Card hover effects
    initCardHoverEffects() {
        const cards = document.querySelectorAll('.stat-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
    }

    // Modal functions (to be connected with your modal system)
    openTransactionModal(type) {
        console.log(`Opening transaction modal for ${type}`);
        // Integration point with your existing modal system
        if (typeof openTransactionModal === 'function') {
            openTransactionModal(type);
        }
    }

    openGoalModal() {
        console.log('Opening goal modal');
        // Integration point with your existing modal system
        if (typeof openGoalModal === 'function') {
            openGoalModal();
        }
    }

    // Add transaction (to be called from your transaction form)
    addTransaction(transaction) {
        this.data.transactions.push({
            ...transaction,
            id: Date.now(),
            timestamp: new Date()
        });

        // Update data based on transaction
        if (transaction.type === 'income') {
            this.data.monthlyIncome += parseFloat(transaction.amount);
        } else {
            this.data.monthlyExpenses += parseFloat(transaction.amount);
            
            // Update expense breakdown
            const category = transaction.category || 'other';
            this.data.expenseBreakdown[category] = (this.data.expenseBreakdown[category] || 0) + parseFloat(transaction.amount);
        }

        // Recalculate totals
        this.data.totalBalance = this.data.monthlyIncome - this.data.monthlyExpenses + 20000; // Base balance
        this.data.savingsRate = Math.round(((this.data.monthlyIncome - this.data.monthlyExpenses) / this.data.monthlyIncome) * 100);

        // Update cards
        this.updateAllCards();
        this.initCharts();
    }

    // Set financial goals
    setGoals(goals) {
        this.data.goals = { ...this.data.goals, ...goals };
        this.updateAllCards();
    }

    // Auto-update data (simulated real-time updates)
    startAutoUpdate() {
        setInterval(() => {
            // Simulate small balance fluctuations
            const fluctuation = (Math.random() - 0.5) * 10;
            this.data.totalBalance += fluctuation;
            
            // Update balance card only
            this.updateBalanceCard();
            this.initBalanceChart();
        }, 30000); // Update every 30 seconds
    }

    // Export data for analytics
    exportData() {
        return {
            summary: {
                totalBalance: this.data.totalBalance,
                monthlyIncome: this.data.monthlyIncome,
                monthlyExpenses: this.data.monthlyExpenses,
                savingsRate: this.data.savingsRate
            },
            transactions: this.data.transactions,
            expenseBreakdown: this.data.expenseBreakdown
        };
    }

    // Import data
    importData(data) {
        this.data = { ...this.data, ...data };
        this.updateAllCards();
        this.initCharts();
    }

    // Get financial insights
    getInsights() {
        const insights = [];
        
        if (this.data.savingsRate > 50) {
            insights.push({
                type: 'positive',
                message: `Great job! Your savings rate of ${this.data.savingsRate}% is excellent.`
            });
        }
        
        if (this.data.monthlyExpenses > this.data.goals.monthlyExpenses) {
            insights.push({
                type: 'warning',
                message: `You're ${this.formatNumber(this.data.monthlyExpenses - this.data.goals.monthlyExpenses)} over your expense goal.`
            });
        }
        
        const topExpense = Object.entries(this.data.expenseBreakdown)
            .sort(([,a], [,b]) => b - a)[0];
        
        if (topExpense) {
            insights.push({
                type: 'info',
                message: `Your highest expense category is ${topExpense[0]} at $${this.formatNumber(topExpense[1])}.`
            });
        }
        
        return insights;
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.financialDashboard = new FinancialDashboard();
});

// Utility functions for external integration
window.updateFinancialData = (data) => {
    if (window.financialDashboard) {
        window.financialDashboard.importData(data);
    }
};

window.addTransaction = (transaction) => {
    if (window.financialDashboard) {
        window.financialDashboard.addTransaction(transaction);
    }
};

window.setFinancialGoals = (goals) => {
    if (window.financialDashboard) {
        window.financialDashboard.setGoals(goals);
    }
};

window.getFinancialInsights = () => {
    return window.financialDashboard ? window.financialDashboard.getInsights() : [];
};
function updateExpenseBreakdown() {
    const expensesByCategory = {};
    financialData.transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
        });

    const breakdown = document.getElementById('expenseBreakdown');
    if (breakdown) {
        breakdown.innerHTML = Object.entries(expensesByCategory)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([category, amount]) => `
                <div class="expense-item">
                    <span class="category">${getCategoryIcon(category)} ${capitalizeFirst(category)}</span>
                    <span class="amount">$${formatCurrency(amount)}</span>
                </div>
            `).join('');
    }
}

// Get Category Icon
function getCategoryIcon(category) {
    const icons = {
        salary: '💼', freelance: '💻', investment: '📈', business: '🏢', gift: '🎁',
        food: '🍕', transport: '🚗', entertainment: '🎬', shopping: '🛍️',
        bills: '📋', healthcare: '🏥', education: '📚', travel: '✈️',
        insurance: '🛡️', other: '📦'
    };
    return icons[category] || '💰';
}

// Capitalize First Letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
