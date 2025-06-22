// Recent Transactions Dashboard JavaScript

class TransactionsDashboard {
    constructor() {
        this.transactions = [];
        this.filteredTransactions = [];
        this.currentFilters = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.renderTransactions();
        this.updateSummaryStats();
    }

    // Sample transaction data
    loadSampleData() {
        const today = new Date();
        const sampleTransactions = [
            {
                id: 'TXN001',
                type: 'income',
                category: 'Salary',
                description: 'Monthly Salary',
                amount: 5000.00,
                date: new Date(today.getTime() - 24 * 60 * 60 * 1000), // Yesterday
                status: 'completed',
                account: 'Checking Account'
            },
            {
                id: 'TXN002',
                type: 'expense',
                category: 'Food',
                description: 'Grocery Shopping',
                amount: -120.50,
                date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                status: 'completed',
                account: 'Credit Card'
            },
            {
                id: 'TXN003',
                type: 'transfer',
                category: 'Internal',
                description: 'Transfer to Savings',
                amount: -1000.00,
                date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                status: 'completed',
                account: 'Checking Account'
            },
            {
                id: 'TXN004',
                type: 'expense',
                category: 'Utilities',
                description: 'Electric Bill',
                amount: -85.75,
                date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
                status: 'pending',
                account: 'Checking Account'
            },
            {
                id: 'TXN005',
                type: 'income',
                category: 'Freelance',
                description: 'Website Development',
                amount: 750.00,
                date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                status: 'completed',
                account: 'Business Account'
            },
            {
                id: 'TXN006',
                type: 'expense',
                category: 'Entertainment',
                description: 'Movie Tickets',
                amount: -28.00,
                date: new Date(), // Today
                status: 'completed',
                account: 'Credit Card'
            },
            {
                id: 'TXN007',
                type: 'expense',
                category: 'Transport',
                description: 'Gas Station',
                amount: -45.20,
                date: new Date(), // Today
                status: 'completed',
                account: 'Debit Card'
            }
        ];

        this.transactions = sampleTransactions.sort((a, b) => b.date - a.date);
        this.filteredTransactions = [...this.transactions];
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('transactionSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filter button
        const filterBtn = document.getElementById('transactionFilter');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                this.toggleFilterMenu();
            });
        }

        // Close filter menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-dropdown') && !e.target.closest('.filter-btn')) {
                this.closeFilterMenu();
            }
        });
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (term === '') {
            this.filteredTransactions = this.applyFilters(this.transactions);
        } else {
            const filtered = this.transactions.filter(transaction => 
                transaction.description.toLowerCase().includes(term) ||
                transaction.category.toLowerCase().includes(term) ||
                transaction.account.toLowerCase().includes(term) ||
                transaction.id.toLowerCase().includes(term)
            );
            this.filteredTransactions = this.applyFilters(filtered);
        }
        
        this.renderTransactions();
    }

    toggleFilterMenu() {
        let filterMenu = document.querySelector('.filter-dropdown');
        
        if (!filterMenu) {
            this.createFilterMenu();
        } else {
            filterMenu.style.display = filterMenu.style.display === 'none' ? 'block' : 'none';
        }
    }

    createFilterMenu() {
        const filterBtn = document.getElementById('transactionFilter');
        const filterMenu = document.createElement('div');
        filterMenu.className = 'filter-dropdown';
        filterMenu.innerHTML = `
            <div class="filter-section">
                <h4>Transaction Type</h4>
                <label><input type="checkbox" value="income" ${this.currentFilters.includes('income') ? 'checked' : ''}> Income</label>
                <label><input type="checkbox" value="expense" ${this.currentFilters.includes('expense') ? 'checked' : ''}> Expense</label>
                <label><input type="checkbox" value="transfer" ${this.currentFilters.includes('transfer') ? 'checked' : ''}> Transfer</label>
            </div>
            <div class="filter-section">
                <h4>Status</h4>
                <label><input type="checkbox" value="completed" ${this.currentFilters.includes('completed') ? 'checked' : ''}> Completed</label>
                <label><input type="checkbox" value="pending" ${this.currentFilters.includes('pending') ? 'checked' : ''}> Pending</label>
            </div>
            <div class="filter-actions">
                <button class="clear-filters-btn">Clear All</button>
                <button class="apply-filters-btn">Apply</button>
            </div>
        `;

        filterBtn.parentElement.style.position = 'relative';
        filterBtn.parentElement.appendChild(filterMenu);

        // Bind filter events
        filterMenu.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                this.updateFilters();
            }
        });

        filterMenu.querySelector('.clear-filters-btn').addEventListener('click', () => {
            this.clearFilters();
        });

        filterMenu.querySelector('.apply-filters-btn').addEventListener('click', () => {
            this.closeFilterMenu();
        });
    }

    updateFilters() {
        const checkboxes = document.querySelectorAll('.filter-dropdown input[type="checkbox"]');
        this.currentFilters = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        this.filteredTransactions = this.applyFilters(this.transactions);
        this.renderTransactions();
        this.updateFilterTags();
    }

    applyFilters(transactions) {
        if (this.currentFilters.length === 0) {
            return transactions;
        }

        return transactions.filter(transaction => {
            return this.currentFilters.includes(transaction.type) || 
                   this.currentFilters.includes(transaction.status);
        });
    }

    clearFilters() {
        this.currentFilters = [];
        const checkboxes = document.querySelectorAll('.filter-dropdown input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        this.filteredTransactions = [...this.transactions];
        this.renderTransactions();
        this.updateFilterTags();
    }

    closeFilterMenu() {
        const filterMenu = document.querySelector('.filter-dropdown');
        if (filterMenu) {
            filterMenu.style.display = 'none';
        }
    }

    updateFilterTags() {
        const filterTags = document.getElementById('filterTags');
        if (!filterTags) return;

        if (this.currentFilters.length === 0) {
            filterTags.innerHTML = '';
            return;
        }

        const tagsHTML = this.currentFilters.map(filter => `
            <span class="filter-tag">
                ${this.capitalizeFirst(filter)}
                <button class="remove-tag" data-filter="${filter}">×</button>
            </span>
        `).join('');

        filterTags.innerHTML = tagsHTML;

        // Bind remove tag events
        filterTags.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-tag')) {
                const filterToRemove = e.target.getAttribute('data-filter');
                this.removeFilter(filterToRemove);
            }
        });
    }

    removeFilter(filterToRemove) {
        this.currentFilters = this.currentFilters.filter(f => f !== filterToRemove);
        
        // Update checkbox state
        const checkbox = document.querySelector(`.filter-dropdown input[value="${filterToRemove}"]`);
        if (checkbox) checkbox.checked = false;
        
        this.filteredTransactions = this.applyFilters(this.transactions);
        this.renderTransactions();
        this.updateFilterTags();
    }

    renderTransactions() {
        const container = document.getElementById('recentTransactions');
        if (!container) return;

        if (this.filteredTransactions.length === 0) {
            container.innerHTML = `
                <div class="no-transactions">
                    <i class="fas fa-receipt"></i>
                    <p>No transactions found</p>
                </div>
            `;
            return;
        }

        // Show only the most recent 5 transactions
        const recentTransactions = this.filteredTransactions.slice(0, 5);
        
        const transactionsHTML = recentTransactions.map(transaction => `
            <div class="transaction-item ${transaction.type}" data-id="${transaction.id}">
                <div class="transaction-icon">
                    <i class="fas ${this.getTransactionIcon(transaction.category)}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-main">
                        <span class="transaction-description">${transaction.description}</span>
                        <span class="transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}">
                            ${transaction.amount >= 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                    </div>
                    <div class="transaction-meta">
                        <span class="transaction-category">${transaction.category}</span>
                        <span class="transaction-date">${this.formatDate(transaction.date)}</span>
                        <span class="transaction-status status-${transaction.status}">${transaction.status}</span>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = transactionsHTML;

        // Add click event to transaction items
        container.addEventListener('click', (e) => {
            const transactionItem = e.target.closest('.transaction-item');
            if (transactionItem) {
                this.showTransactionDetails(transactionItem.getAttribute('data-id'));
            }
        });
    }

    getTransactionIcon(category) {
        const iconMap = {
            'Salary': 'fa-money-check-alt',
            'Freelance': 'fa-laptop',
            'Food': 'fa-utensils',
            'Utilities': 'fa-bolt',
            'Transport': 'fa-car',
            'Entertainment': 'fa-film',
            'Internal': 'fa-exchange-alt',
            'default': 'fa-credit-card'
        };
        return iconMap[category] || iconMap.default;
    }

    formatDate(date) {
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        
        if (this.isSameDay(date, today)) {
            return 'Today';
        } else if (this.isSameDay(date, yesterday)) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    isSameDay(date1, date2) {
        return date1.toDateString() === date2.toDateString();
    }

    updateSummaryStats() {
        const today = new Date();
        const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const todayTransactions = this.transactions.filter(t => 
            this.isSameDay(t.date, today)
        ).length;

        const weekTransactions = this.transactions.filter(t => 
            t.date >= weekStart
        ).length;

        const todayElement = document.getElementById('todayTransactions');
        const weekElement = document.getElementById('weekTransactions');

        if (todayElement) todayElement.textContent = todayTransactions;
        if (weekElement) weekElement.textContent = weekTransactions;
    }

    showTransactionDetails(transactionId) {
        const transaction = this.transactions.find(t => t.id === transactionId);
        if (!transaction) return;

        // Create modal or detailed view
        alert(`Transaction Details:
ID: ${transaction.id}
Description: ${transaction.description}
Amount: $${transaction.amount.toFixed(2)}
Category: ${transaction.category}
Account: ${transaction.account}
Date: ${transaction.date.toLocaleDateString()}
Status: ${transaction.status}`);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Public method to add new transaction
    addTransaction(transaction) {
        this.transactions.unshift({
            ...transaction,
            id: 'TXN' + String(Date.now()).slice(-6),
            date: new Date()
        });
        this.filteredTransactions = this.applyFilters(this.transactions);
        this.renderTransactions();
        this.updateSummaryStats();
    }

    // Public method to refresh data
    refresh() {
        this.renderTransactions();
        this.updateSummaryStats();
    }
}

// Function to switch to transactions section (referenced in HTML)
function switchToSection(section) {
    console.log(`Switching to ${section} section`);
    // Implement navigation logic here
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.transactionsDashboard = new TransactionsDashboard();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransactionsDashboard;
}