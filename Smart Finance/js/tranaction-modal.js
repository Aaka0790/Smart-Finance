// Transaction Modal JavaScript
class TransactionModal {
    constructor() {
        this.modal = document.getElementById('transactionModal');
        this.form = document.getElementById('transactionForm');
        this.isEditMode = false;
        this.currentTransactionId = null;
        
        this.initializeEventListeners();
        this.setDefaultDate();
    }

    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Recurring checkbox toggle
        const recurringCheckbox = document.getElementById('isRecurring');
        const recurringOptions = document.getElementById('recurringOptions');
        
        recurringCheckbox.addEventListener('change', () => {
            recurringOptions.style.display = recurringCheckbox.checked ? 'block' : 'none';
        });
        
        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
        
        // Add category button
        const addCategoryBtn = document.getElementById('addCategoryBtn');
        addCategoryBtn.addEventListener('click', () => this.showAddCategoryDialog());
        
        // Amount input formatting
        const amountInput = document.getElementById('transactionAmount');
        amountInput.addEventListener('input', (e) => this.formatAmount(e));
    }

    setDefaultDate() {
        const dateInput = document.getElementById('transactionDate');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    openModal(transactionData = null) {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        if (transactionData) {
            this.populateForm(transactionData);
            this.isEditMode = true;
            this.currentTransactionId = transactionData.id;
            document.getElementById('modalTitle').textContent = 'Add Transection';
            document.querySelector('.btn-primary').innerHTML = '<i class="fas fa-save"></i> Update Transaction';
        } else {
            this.resetForm();
            this.isEditMode = false;
            this.currentTransactionId = null;
            document.getElementById('modalTitle').textContent = 'Add Expenses';
            document.querySelector('.btn-primary').innerHTML = '<i class="fas fa-plus"></i> Add Transaction';
        }
        
        // Focus first input
        setTimeout(() => {
            document.getElementById('transactionAmount').focus();
        }, 100);
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetForm();
    }

    resetForm() {
        this.form.reset();
        this.setDefaultDate();
        document.getElementById('recurringOptions').style.display = 'none';
        this.clearValidationErrors();
    }

    populateForm(data) {
        document.getElementById('transactionAmount').value = Math.abs(data.amount);
        document.getElementById('transactionDate').value = data.date;
        document.getElementById('transactionCategory').value = data.category;
        document.getElementById('transactionDescription').value = data.description || '';
        document.getElementById('transactionAccount').value = data.account || 'checking';
        
        if (data.recurring) {
            document.getElementById('isRecurring').checked = true;
            document.getElementById('recurringOptions').style.display = 'block';
            document.getElementById('recurringFrequency').value = data.recurring.frequency;
            document.getElementById('recurringEnd').value = data.recurring.endDate || '';
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const formData = this.collectFormData();
        
        // Disable submit button to prevent double submission
        const submitBtn = document.querySelector('.btn-primary');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        if (this.isEditMode) {
            this.updateTransaction(formData);
        } else {
            this.addTransaction(formData);
        }
    }

    collectFormData() {
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const category = document.getElementById('transactionCategory').value;
        const isIncome = this.isIncomeCategory(category);
        
        const data = {
            amount: isIncome ? amount : -amount,
            date: document.getElementById('transactionDate').value,
            category: category,
            description: document.getElementById('transactionDescription').value.trim(),
            account: document.getElementById('transactionAccount').value
        };
        
        if (document.getElementById('isRecurring').checked) {
            data.recurring = {
                frequency: document.getElementById('recurringFrequency').value,
                endDate: document.getElementById('recurringEnd').value
            };
        }
        
        return data;
    }

    isIncomeCategory(category) {
        const incomeCategories = ['salary', 'freelance', 'investment', 'business', 'gift'];
        return incomeCategories.includes(category);
    }

    validateForm() {
        let isValid = true;
        this.clearValidationErrors();
        
        // Required fields
        const requiredFields = [
            { id: 'transactionAmount', message: 'Amount is required' },
            { id: 'transactionDate', message: 'Date is required' },
            { id: 'transactionCategory', message: 'Category is required' }
        ];
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element.value.trim()) {
                this.showFieldError(element, field.message);
                isValid = false;
            }
        });
        
        // Amount validation
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        if (amount <= 0) {
            this.showFieldError(document.getElementById('transactionAmount'), 'Amount must be greater than 0');
            isValid = false;
        }
        
        // Date validation
        const selectedDate = new Date(document.getElementById('transactionDate').value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (selectedDate > today) {
            this.showFieldError(document.getElementById('transactionDate'), 'Date cannot be in the future');
            isValid = false;
        }
        
        return isValid;
    }

    showFieldError(element, message) {
        element.style.borderColor = '#ef4444';
        
        // Create error message if it doesn't exist
        let errorElement = element.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '12px';
            errorElement.style.marginTop = '4px';
            element.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearValidationErrors() {
        // Reset border colors
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
        
        // Remove error messages
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }

    formatAmount(e) {
        let value = e.target.value;
        // Remove any non-numeric characters except decimal point
        value = value.replace(/[^0-9.]/g, '');
        
        // Ensure only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        // Limit decimal places to 2
        if (parts[1] && parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].substring(0, 2);
        }
        
        e.target.value = value;
    }

    showAddCategoryDialog() {
        const categoryName = prompt('Enter new category name:');
        if (categoryName && categoryName.trim()) {
            this.addCustomCategory(categoryName.trim());
        }
    }

    addCustomCategory(categoryName) {
        const categorySelect = document.getElementById('transactionCategory');
        const expenseGroup = categorySelect.querySelector('optgroup[label="Expenses"]');
        
        const option = document.createElement('option');
        option.value = categoryName.toLowerCase().replace(/\s+/g, '-');
        option.textContent = `📦 ${categoryName}`;
        
        expenseGroup.appendChild(option);
        categorySelect.value = option.value;
    }

    addTransaction(data) {
        // Simulate API call
        setTimeout(() => {
            console.log('Adding transaction:', data);
            
            // Here you would typically make an API call
            // fetch('/api/transactions', { method: 'POST', body: JSON.stringify(data) })
            
            this.onTransactionAdded(data);
            this.closeModal();
            this.showSuccessMessage('Transaction added successfully!');
            
            // Re-enable submit button
            const submitBtn = document.querySelector('.btn-primary');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Transaction';
        }, 500);
    }

    updateTransaction(data) {
        // Simulate API call
        setTimeout(() => {
            console.log('Updating transaction:', this.currentTransactionId, data);
            
            // Here you would typically make an API call
            // fetch(`/api/transactions/${this.currentTransactionId}`, { method: 'PUT', body: JSON.stringify(data) })
            
            this.onTransactionUpdated(this.currentTransactionId, data);
            this.closeModal();
            this.showSuccessMessage('Transaction updated successfully!');
            
            // Re-enable submit button
            const submitBtn = document.querySelector('.btn-primary');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Transaction';
        }, 500);
    }

    showSuccessMessage(message) {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 2000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Callback methods - override these in your implementation
    onTransactionAdded(data) {
        // Override this method to handle transaction addition
        console.log('Transaction added callback:', data);
    }

    onTransactionUpdated(id, data) {
        // Override this method to handle transaction update
        console.log('Transaction updated callback:', id, data);
    }
}

// Global functions for backward compatibility
function closeModal(modalId) {
    if (modalId === 'transactionModal' && window.transactionModal) {
        window.transactionModal.closeModal();
    }
}

// Initialize the modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.transactionModal = new TransactionModal();
    
    // Example usage functions - you can call these from your main app
    window.openTransactionModal = (transactionData = null) => {
        window.transactionModal.openModal(transactionData);
    };
    
    window.closeTransactionModal = () => {
        window.transactionModal.closeModal();
    };
});

