  class ProfessionalBackground {
            constructor() {
                this.dataPoints = [];
                this.chartLines = [];
                this.glowAccents = [];
                this.dataStreams = [];
                this.metricIndicators = [];
                this.stats = {
                    cpu: 45,
                    memory: 2.1,
                    network: 1.2,
                    active: 127
                };
                
                this.init();
            }

            init() {
                this.createDataPoints();
                this.createChartLines();
                this.createGlowAccents();
                this.createDataStreams();
                this.createMetricIndicators();
                this.startStatsUpdate();
            }

            createDataPoints() {
                const container = document.body;
                
                for (let i = 0; i < 25; i++) {
                    const point = document.createElement('div');
                    point.className = 'data-point';
                    point.style.left = Math.random() * window.innerWidth + 'px';
                    point.style.top = Math.random() * window.innerHeight + 'px';
                    point.style.animationDelay = Math.random() * 12 + 's';
                    
                    container.appendChild(point);
                    this.dataPoints.push(point);
                }
            }

            createChartLines() {
                const container = document.body;
                
                for (let i = 0; i < 8; i++) {
                    const line = document.createElement('div');
                    line.className = 'chart-line';
                    line.style.top = Math.random() * window.innerHeight + 'px';
                    line.style.left = '0px';
                    line.style.animationDelay = Math.random() * 8 + 's';
                    
                    container.appendChild(line);
                    this.chartLines.push(line);
                }
            }

            createGlowAccents() {
                const container = document.body;
                
                for (let i = 0; i < 6; i++) {
                    const glow = document.createElement('div');
                    glow.className = 'glow-accent';
                    glow.style.width = (50 + Math.random() * 100) + 'px';
                    glow.style.height = (50 + Math.random() * 100) + 'px';
                    glow.style.left = Math.random() * window.innerWidth + 'px';
                    glow.style.top = Math.random() * window.innerHeight + 'px';
                    glow.style.animationDelay = Math.random() * 8 + 's';
                    
                    container.appendChild(glow);
                    this.glowAccents.push(glow);
                }
            }

            createDataStreams() {
                const container = document.body;
                
                for (let i = 0; i < 12; i++) {
                    const stream = document.createElement('div');
                    stream.className = 'data-stream';
                    stream.style.left = Math.random() * window.innerWidth + 'px';
                    stream.style.animationDelay = Math.random() * 6 + 's';
                    
                    container.appendChild(stream);
                    this.dataStreams.push(stream);
                }
            }

            createMetricIndicators() {
                const container = document.body;
                const metrics = ['CPU: 45%', 'MEM: 2.1GB', 'NET: 1.2MB/s', 'PROC: 127', 'TEMP: 42°C', 'DISK: 85%'];
                
                for (let i = 0; i < 8; i++) {
                    const metric = document.createElement('div');
                    metric.className = 'metric-indicator';
                    metric.textContent = metrics[Math.floor(Math.random() * metrics.length)];
                    metric.style.left = Math.random() * (window.innerWidth - 100) + 'px';
                    metric.style.animationDelay = Math.random() * 15 + 's';
                    
                    container.appendChild(metric);
                    this.metricIndicators.push(metric);
                }
            }

            startStatsUpdate() {
                setInterval(() => {
                    this.updateStats();
                }, 2000);
            }

            updateStats() {
                // Simulate realistic stat changes
                this.stats.cpu = Math.max(20, Math.min(95, this.stats.cpu + (Math.random() - 0.5) * 10));
                this.stats.memory = Math.max(1.0, Math.min(8.0, this.stats.memory + (Math.random() - 0.5) * 0.5));
                this.stats.network = Math.max(0.1, Math.min(5.0, this.stats.network + (Math.random() - 0.5) * 0.8));
                this.stats.active = Math.max(50, Math.min(200, this.stats.active + Math.floor((Math.random() - 0.5) * 20)));

                // Update display
                document.getElementById('cpu').textContent = Math.round(this.stats.cpu) + '%';
                document.getElementById('memory').textContent = this.stats.memory.toFixed(1) + 'GB';
                document.getElementById('network').textContent = this.stats.network.toFixed(1) + 'MB/s';
                document.getElementById('active').textContent = this.stats.active.toString();
            }

            // Method to add new data points dynamically
            addDataPoint(x, y) {
                const point = document.createElement('div');
                point.className = 'data-point';
                point.style.left = x + 'px';
                point.style.top = y + 'px';
                point.style.animationDelay = '0s';
                
                document.body.appendChild(point);
                this.dataPoints.push(point);

                // Remove after animation
                setTimeout(() => {
                    if (point.parentNode) {
                        point.parentNode.removeChild(point);
                    }
                    const index = this.dataPoints.indexOf(point);
                    if (index > -1) {
                        this.dataPoints.splice(index, 1);
                    }
                }, 12000);
            }

            // Cleanup method
            cleanup() {
                [...this.dataPoints, ...this.chartLines, ...this.glowAccents, 
                 ...this.dataStreams, ...this.metricIndicators].forEach(element => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                });
            }
        }

        // Initialize the professional background
        let professionalBg;
        
        document.addEventListener('DOMContentLoaded', () => {
            professionalBg = new ProfessionalBackground();
        });

        // Optional: Add interactive data points on click
        document.addEventListener('click', (e) => {
            if (professionalBg && e.target === document.body) {
                professionalBg.addDataPoint(e.clientX, e.clientY);
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (professionalBg) {
                professionalBg.cleanup();
                professionalBg = new ProfessionalBackground();
            }
        });