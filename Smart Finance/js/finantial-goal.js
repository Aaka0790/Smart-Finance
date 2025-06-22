   let goals = [
            { id: 1, title: "Emergency Fund", target: 10000, current: 7500, deadline: "2025-12-31" },
            { id: 2, title: "Vacation", target: 5000, current: 2800, deadline: "2025-08-15" },
            { id: 3, title: "New Car", target: 25000, current: 15000, deadline: "2026-03-01" }
        ];

        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            }).format(amount);
        }

        function calculateProgress(current, target) {
            return Math.min((current / target) * 100, 100);
        }

        function renderGoals() {
            const goalsList = document.getElementById('goalsList');
            
            if (goals.length === 0) {
                goalsList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🎯</div>
                        <p>No goals yet. Create your first financial goal!</p>
                    </div>
                `;
                return;
            }

            goalsList.innerHTML = goals.map(goal => {
                const progress = calculateProgress(goal.current, goal.target);
                return `
                    <div class="goal-item">
                        <div class="goal-header">
                            <div class="goal-title">${goal.title}</div>
                            <div class="goal-amount">${formatCurrency(goal.target)}</div>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="progress-text">
                                <span>${formatCurrency(goal.current)}</span>
                                <span>${Math.round(progress)}%</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function renderSummary() {
            const summary = document.getElementById('goalsSummary');
            
            if (goals.length === 0) {
                summary.innerHTML = '';
                return;
            }

            const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
            const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
            const overallProgress = (totalSaved / totalTarget) * 100;
            const completedGoals = goals.filter(goal => goal.current >= goal.target).length;

            summary.innerHTML = `
                <div class="summary">
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span class="summary-value">${Math.round(overallProgress)}%</span>
                            <div class="summary-label">Overall Progress</div>
                        </div>
                        <div class="summary-item">
                            <span class="summary-value">${completedGoals}/${goals.length}</span>
                            <div class="summary-label">Goals Completed</div>
                        </div>
                    </div>
                </div>
            `;
        }

        function addNewGoal() {
            const titles = ["House Down Payment", "Investment Portfolio", "Education Fund", "Retirement Savings", "Travel Fund"];
            const randomTitle = titles[Math.floor(Math.random() * titles.length)];
            const randomTarget = Math.floor(Math.random() * 20000) + 5000;
            const randomCurrent = Math.floor(Math.random() * randomTarget * 0.7);
            
            const newGoal = {
                id: Date.now(),
                title: randomTitle,
                target: randomTarget,
                current: randomCurrent,
                deadline: "2025-12-31"
            };
            
            goals.push(newGoal);
            renderGoals();
            renderSummary();
        }

        // Initialize
        renderGoals();
        renderSummary();

        // Add some animation on load
        setTimeout(() => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }, 500);