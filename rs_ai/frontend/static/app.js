// Global state
let currentCountry = null;
let currentQuery = null;
let analysisData = null;

// DOM elements
const countrySelect = document.getElementById('country-select');
const queryInput = document.getElementById('query-input');
const analyzeBtn = document.getElementById('analyze-btn');
const loadingState = document.getElementById('loading-state');
const loadingCountry = document.getElementById('loading-country');
const resultsContainer = document.getElementById('results-container');
const riskSenseLink = document.getElementById('risk-sense-link');
const nibLink = document.getElementById('nib-link');
const riskSenseView = document.getElementById('risk-sense-view');
const nibView = document.getElementById('nib-view');
const nibLoadingState = document.getElementById('nib-loading-state');
const nibContent = document.getElementById('nib-content');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Fetch countries for dropdown
    fetchCountries();
    
    // Add event listeners
    analyzeBtn.addEventListener('click', startAnalysis);
    riskSenseLink.addEventListener('click', showRiskSenseView);
    nibLink.addEventListener('click', showNIBView);
    
    // Set default values
    queryInput.value = 'Investment Opportunities';
});

// Fetch countries from API
async function fetchCountries() {
    try {
        const response = await fetch('/api/countries');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const countries = await response.json();
        
        // Populate country dropdown
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
        showError('Failed to load countries. Please refresh the page or try again later.');
    }
}

// Start analysis
function startAnalysis() {
    const countryCode = countrySelect.value;
    const query = queryInput.value.trim();
    
    if (!countryCode) {
        alert('Please select a country');
        return;
    }
    
    if (!query) {
        alert('Please enter a query');
        return;
    }
    
    // Update state
    currentCountry = countryCode;
    currentQuery = query;
    
    // Show loading state
    loadingCountry.textContent = countrySelect.options[countrySelect.selectedIndex].text;
    loadingState.style.display = 'flex';
    resultsContainer.style.display = 'none';
    
    // Fetch analysis data
    fetchAnalysisData(countryCode, query);
}

// Fetch analysis data from API
async function fetchAnalysisData(countryCode, query) {
    try {
        const response = await fetch('/api/analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                countryCode,
                query
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Save to state
        analysisData = data;
        
        // Update UI
        updateUI(data);
        
    } catch (error) {
        console.error('Error fetching analysis data:', error);
        loadingState.style.display = 'none';
        showError('Failed to analyze data. Please try again later.');
    }
}

// Update UI with analysis data
function updateUI(data) {
    // Hide loading, show results
    loadingState.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    // Update each tab with relevant data
    updateOverviewTab(data.overview);
    updateEconomicTab(data.economic);
    updateNewsTab(data.news);
    updateAITab(data.aiInsights);
    
    // Fetch and update other tabs
    fetchClimateData(currentCountry);
    fetchP3Data(currentCountry, currentQuery);
    fetchRiskScenariosData(currentCountry, currentQuery);
    fetchRiskRatingsData(currentCountry);
}

// Update Overview tab
function updateOverviewTab(overview) {
    const overviewContent = document.getElementById('overview-content');
    
    if (!overview) {
        overviewContent.innerHTML = '<p>No overview data available.</p>';
        return;
    }
    
    let html = `
        <div class="row">
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-header">Country Summary</div>
                    <div class="card-body">
                        <ul class="list-unstyled">
    `;
    
    overview.summary.forEach(item => {
        html += `<li class="mb-2">• ${item}</li>`;
    });
    
    html += `
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-header">Key Statistics</div>
                    <div class="card-body">
                        <div class="mb-2">
                            <strong>Population:</strong> ${overview.population} (${overview.populationYear})
                        </div>
                        <div class="mb-2">
                            <strong>GDP:</strong> ${overview.gdp}
                        </div>
                        <div class="mb-2">
                            <strong>GDP Per Capita:</strong> ${overview.gdpPerCapita}
                        </div>
                        <div class="mb-2">
                            <strong>Government:</strong> ${overview.government}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    overviewContent.innerHTML = html;
}

// Update Economic tab
function updateEconomicTab(economic) {
    const economicContent = document.getElementById('economic-content');
    
    if (!economic || !economic.indicators || economic.indicators.length === 0) {
        economicContent.innerHTML = '<p>No economic data available.</p>';
        return;
    }
    
    let html = `
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header">Economic Indicators</div>
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Indicator</th>
                                    <th>Value</th>
                                    <th>Year</th>
                                    <th>Change</th>
                                </tr>
                            </thead>
                            <tbody>
    `;
    
    economic.indicators.forEach(indicator => {
        const changeDirection = indicator.change.direction === 'up' 
            ? '<span class="text-success">↑</span>' 
            : indicator.change.direction === 'down' 
                ? '<span class="text-danger">↓</span>' 
                : '<span class="text-muted">→</span>';
                
        html += `
            <tr>
                <td>${indicator.indicator}</td>
                <td>${indicator.value}</td>
                <td>${indicator.year}</td>
                <td>${changeDirection} ${indicator.change.value}</td>
            </tr>
        `;
    });
    
    html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header">GDP Growth Trend</div>
                    <div class="card-body">
                        <canvas id="gdp-chart" height="250"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header">Unemployment Trend</div>
                    <div class="card-body">
                        <canvas id="unemployment-chart" height="250"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header">Regional Comparison</div>
                    <div class="card-body">
                        <canvas id="comparison-chart" height="250"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    economicContent.innerHTML = html;
    
    // Fetch and display chart data
    fetchEconomicCharts(currentCountry);
}

// Update News tab
function updateNewsTab(news) {
    const newsContent = document.getElementById('news-content');
    
    if (!news || !news.articles || news.articles.length === 0) {
        newsContent.innerHTML = '<p>No news articles available.</p>';
        
        // If we have sentiment data but no articles, still show the sentiment chart
        if (news && news.sentiment) {
            renderSentimentChart(news.sentiment);
        }
        
        return;
    }
    
    let html = `
        <div class="row mb-4">
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-header">News Sentiment Analysis</div>
                    <div class="card-body">
                        <canvas id="sentiment-chart" height="250"></canvas>
                        <div class="text-center mt-3">
                            <p><strong>Summary:</strong> ${news.sentiment.summary}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card h-100">
                    <div class="card-header">Recent News Articles</div>
                    <div class="card-body">
                        <div class="list-group">
    `;
    
    news.articles.forEach(article => {
        const date = new Date(article.date).toLocaleDateString();
        
        let tags = '';
        if (article.tags && article.tags.length > 0) {
            tags = article.tags.map(tag => `<span class="badge bg-light text-dark me-1">${tag}</span>`).join(' ');
        }
        
        html += `
            <a href="${article.url}" target="_blank" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${article.title}</h5>
                    <small class="text-muted">${date}</small>
                </div>
                <p class="mb-1">${article.description}</p>
                <small class="text-muted">${article.source}</small>
                <div class="mt-2">${tags}</div>
            </a>
        `;
    });
    
    html += `
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    newsContent.innerHTML = html;
    
    // Render sentiment chart
    renderSentimentChart(news.sentiment);
}

// Update AI Insights tab
function updateAITab(aiInsights) {
    const aiContent = document.getElementById('ai-content');
    
    if (!aiInsights) {
        aiContent.innerHTML = '<p>No AI insights available.</p>';
        return;
    }
    
    let followUpQuestionsHtml = '';
    if (aiInsights.followUpQuestions && aiInsights.followUpQuestions.length > 0) {
        followUpQuestionsHtml = `
            <div class="mt-4">
                <h5>Follow-up Questions:</h5>
                <ul class="list-group">
        `;
        
        aiInsights.followUpQuestions.forEach(q => {
            followUpQuestionsHtml += `
                <li class="list-group-item">
                    <a href="#" class="follow-up-question">${q.question}</a>
                </li>
            `;
        });
        
        followUpQuestionsHtml += `
                </ul>
            </div>
        `;
    }
    
    let html = `
        <div class="row">
            <div class="col-12">
                <div class="card mb-4">
                    <div class="card-header">AI Analysis</div>
                    <div class="card-body">
                        <div class="ai-analysis">
                            ${aiInsights.analysis}
                        </div>
                        ${followUpQuestionsHtml}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    aiContent.innerHTML = html;
    
    // Add event listeners for follow-up questions
    document.querySelectorAll('.follow-up-question').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            askFollowUpQuestion(e.target.textContent);
        });
    });
}

// Fetch and update Climate tab
async function fetchClimateData(countryCode) {
    const climateContent = document.getElementById('climate-content');
    climateContent.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading climate data...</p></div>';
    
    try {
        const response = await fetch(`/api/cdp/${countryCode}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.hasData) {
            climateContent.innerHTML = `<p class="alert alert-info">${data.message || 'No climate data available for this country.'}</p>`;
            return;
        }
        
        let cityList = '';
        if (data.cityList && data.cityList.length > 0) {
            cityList = data.cityList.map(city => `<span class="badge bg-light text-dark me-1 mb-1">${city}</span>`).join(' ');
        }
        
        let targetTypes = '';
        if (data.targetTypes && data.targetTypes.length > 0) {
            targetTypes = data.targetTypes.map(type => `<span class="badge bg-success me-1 mb-1">${type}</span>`).join(' ');
        }
        
        let html = `
            <div class="row">
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-header">Renewable Energy Targets</div>
                        <div class="card-body">
                            <div class="mb-3">
                                <strong>Country:</strong> ${data.countryName}
                            </div>
                            <div class="mb-3">
                                <strong>Cities with Targets:</strong> ${data.citiesWithTargets || 'N/A'}
                            </div>
                            <div class="mb-3">
                                <strong>Total Targets:</strong> ${data.totalTargets || 'N/A'}
                            </div>
                            <div class="mb-3">
                                <strong>Average Target Year:</strong> ${data.averageTargetYear || 'N/A'}
                            </div>
                            <div class="mb-3">
                                <strong>Average Renewable Percentage:</strong> ${data.averageRenewablePercentage ? data.averageRenewablePercentage + '%' : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-header">Participating Cities</div>
                        <div class="card-body">
                            <div class="mb-3">
                                ${cityList || 'No city data available.'}
                            </div>
                            <hr>
                            <div>
                                <strong>Target Types:</strong>
                                <div class="mt-2">
                                    ${targetTypes || 'No target type data available.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header">CDP Data Source</div>
                        <div class="card-body">
                            <p>
                                The data presented here is based on CDP (Carbon Disclosure Project) reports. 
                                CDP is a not-for-profit charity that runs the global disclosure system for investors, 
                                companies, cities, states and regions to manage their environmental impacts.
                            </p>
                            <p class="mb-0">
                                <a href="https://www.cdp.net" target="_blank" class="btn btn-sm btn-outline-primary">
                                    Learn more about CDP
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        climateContent.innerHTML = html;
        
    } catch (error) {
        console.error('Error fetching climate data:', error);
        climateContent.innerHTML = '<p class="alert alert-danger">Failed to load climate data. Please try again later.</p>';
    }
}

// Fetch and update P3 Strategy tab
async function fetchP3Data(countryCode, query) {
    const p3Content = document.getElementById('p3-content');
    p3Content.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading P3 strategy data...</p></div>';
    
    try {
        const response = await fetch(`/api/p3/${countryCode}?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        let html = `
            <div class="p3-section predict">
                <h4>PREDICT - Identifying Potential Risks</h4>
                <p>${data.predict || 'No prediction data available.'}</p>
            </div>
            <div class="p3-section prevent">
                <h4>PREVENT - Mitigating Strategies</h4>
                <p>${data.prevent || 'No prevention data available.'}</p>
            </div>
            <div class="p3-section protect">
                <h4>PROTECT - Response Mechanisms</h4>
                <p>${data.protect || 'No protection data available.'}</p>
            </div>
        `;
        
        p3Content.innerHTML = html;
        
    } catch (error) {
        console.error('Error fetching P3 data:', error);
        p3Content.innerHTML = '<p class="alert alert-danger">Failed to load P3 strategy data. Please try again later.</p>';
    }
}

// Fetch and update Risk Scenarios tab
async function fetchRiskScenariosData(countryCode, query) {
    const riskContent = document.getElementById('risk-content');
    riskContent.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading risk scenarios data...</p></div>';
    
    try {
        const response = await fetch(`/api/projects/${countryCode}?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const projects = await response.json();
        
        if (!projects || projects.length === 0) {
            riskContent.innerHTML = '<p class="alert alert-info">No project risk data available for this country.</p>';
            return;
        }
        
        // Group projects by status
        const fundedProjects = projects.filter(p => p.status === 'funded');
        const onHoldProjects = projects.filter(p => p.status === 'on_hold');
        const proposedProjects = projects.filter(p => p.status === 'proposed');
        
        let html = `
            <ul class="nav nav-pills mb-4" id="risk-scenarios-tabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="funded-tab" data-bs-toggle="pill" data-bs-target="#funded-projects" type="button" role="tab">
                        Funded Projects (${fundedProjects.length})
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="on-hold-tab" data-bs-toggle="pill" data-bs-target="#on-hold-projects" type="button" role="tab">
                        On Hold Projects (${onHoldProjects.length})
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="proposed-tab" data-bs-toggle="pill" data-bs-target="#proposed-projects" type="button" role="tab">
                        Proposed Projects (${proposedProjects.length})
                    </button>
                </li>
            </ul>
            
            <div class="tab-content" id="risk-scenarios-content">
                <div class="tab-pane fade show active" id="funded-projects" role="tabpanel">
                    ${generateProjectsTable(fundedProjects)}
                </div>
                <div class="tab-pane fade" id="on-hold-projects" role="tabpanel">
                    ${generateProjectsTable(onHoldProjects)}
                </div>
                <div class="tab-pane fade" id="proposed-projects" role="tabpanel">
                    ${generateProjectsTable(proposedProjects)}
                </div>
            </div>
        `;
        
        riskContent.innerHTML = html;
        
    } catch (error) {
        console.error('Error fetching risk scenarios data:', error);
        riskContent.innerHTML = '<p class="alert alert-danger">Failed to load risk scenarios data. Please try again later.</p>';
    }
}

// Generate projects table
function generateProjectsTable(projects) {
    if (!projects || projects.length === 0) {
        return '<p class="alert alert-info">No projects in this category.</p>';
    }
    
    let html = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Sector</th>
                        <th>Budget (M USD)</th>
                        <th>Timeline</th>
                        <th>Risk Level</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    projects.forEach(project => {
        const startDate = new Date(project.startDate).toLocaleDateString();
        const endDate = new Date(project.expectedEndDate).toLocaleDateString();
        
        // Determine risk badge color
        let riskBadgeClass = 'bg-success';
        if (project.currentRisk === 'medium') {
            riskBadgeClass = 'bg-warning text-dark';
        } else if (project.currentRisk === 'high') {
            riskBadgeClass = 'bg-danger';
        } else if (project.currentRisk === 'critical') {
            riskBadgeClass = 'bg-dark';
        }
        
        // Show risk level change if applicable
        let riskChangeIndicator = '';
        if (project.previousRisk && project.previousRisk !== project.currentRisk) {
            const isIncreased = isRiskIncreased(project.previousRisk, project.currentRisk);
            riskChangeIndicator = isIncreased 
                ? '<span class="text-danger ms-2">↑</span>' 
                : '<span class="text-success ms-2">↓</span>';
        }
        
        html += `
            <tr>
                <td>
                    <strong>${project.name}</strong>
                    <p class="mb-0 small text-muted">${project.description}</p>
                </td>
                <td>${project.sector}</td>
                <td>${project.budget}</td>
                <td>${startDate} - ${endDate}</td>
                <td>
                    <span class="badge ${riskBadgeClass}">${project.currentRisk.toUpperCase()}</span>
                    ${riskChangeIndicator}
                </td>
            </tr>
            <tr>
                <td colspan="5" class="border-0 pt-0">
                    <div class="ps-3 mb-3">
                        <strong>Risk Factors:</strong> ${project.riskFactors.join(', ')}
                        <br>
                        <strong>Impact Analysis:</strong> ${project.impactAnalysis}
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Check if risk level increased
function isRiskIncreased(previousRisk, currentRisk) {
    const riskLevels = {
        'low': 0,
        'medium': 1,
        'high': 2,
        'critical': 3
    };
    
    return riskLevels[currentRisk] > riskLevels[previousRisk];
}

// Fetch and update Risk Ratings tab
function fetchRiskRatingsData(countryCode) {
    // For this demo, we'll use mock data
    // In a real application, you would fetch this from the API
    const riskratingContent = document.getElementById('riskrating-content');
    riskratingContent.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading risk ratings data...</p></div>';
    
    // Mock data for demonstration
    setTimeout(() => {
        const companies = [
            {
                id: '1',
                name: 'National Energy Corporation',
                country: countryCode,
                sector: 'Energy',
                oldRating: 'AA-',
                aiRiskLevel: 'High',
                riskFactors: ['Regulatory changes', 'Market volatility', 'Climate transition risks']
            },
            {
                id: '2',
                name: 'Global Finance Group',
                country: countryCode,
                sector: 'Finance',
                oldRating: 'A+',
                aiRiskLevel: 'Medium',
                riskFactors: ['Cybersecurity threats', 'Interest rate fluctuations']
            },
            {
                id: '3',
                name: 'Tech Innovations Inc.',
                country: countryCode,
                sector: 'Technology',
                oldRating: 'BBB+',
                aiRiskLevel: 'Low',
                riskFactors: ['Talent acquisition challenges']
            },
            {
                id: '4',
                name: 'Agricultural Producers Ltd.',
                country: countryCode,
                sector: 'Agriculture',
                oldRating: 'BB',
                aiRiskLevel: 'High',
                riskFactors: ['Climate change impacts', 'Supply chain disruptions', 'Water scarcity']
            },
            {
                id: '5',
                name: 'National Telecommunications',
                country: countryCode,
                sector: 'Telecommunications',
                oldRating: 'A-',
                aiRiskLevel: 'Medium',
                riskFactors: ['Technological obsolescence', 'Regulatory compliance costs']
            }
        ];
        
        let html = `
            <div class="alert alert-info mb-4">
                <h5>Risk Rating Methodology</h5>
                <p class="mb-0">
                    This analysis combines traditional credit ratings with AI-powered risk assessments. Companies with 
                    "High" AI risk levels have their ratings adjusted downward to reflect emerging risks not yet captured 
                    in traditional ratings.
                </p>
            </div>
            
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Sector</th>
                            <th>Traditional Rating</th>
                            <th>AI Risk Level</th>
                            <th>Adjusted Rating</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        companies.forEach(company => {
            // Determine risk status class
            let riskStatusClass = '';
            if (company.aiRiskLevel === 'High') {
                riskStatusClass = 'risk-status high';
            } else if (company.aiRiskLevel === 'Medium') {
                riskStatusClass = 'risk-status medium';
            } else {
                riskStatusClass = 'risk-status low';
            }
            
            // Calculate adjusted rating for high risk companies
            let adjustedRating = company.oldRating;
            let status = '';
            
            if (company.aiRiskLevel === 'High') {
                // Downgrade by one notch
                const ratings = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-', 'B+', 'B', 'B-'];
                const currentIndex = ratings.indexOf(company.oldRating);
                
                if (currentIndex !== -1 && currentIndex < ratings.length - 1) {
                    adjustedRating = ratings[currentIndex + 1];
                    status = `<span class="badge bg-danger">Downgrade</span>`;
                }
            } else if (company.aiRiskLevel === 'Medium') {
                status = `<span class="badge bg-warning text-dark">Watch</span>`;
            } else {
                status = `<span class="badge bg-success">Stable</span>`;
            }
            
            html += `
                <tr>
                    <td>
                        <strong>${company.name}</strong>
                    </td>
                    <td>${company.sector}</td>
                    <td>${company.oldRating}</td>
                    <td><span class="${riskStatusClass}">${company.aiRiskLevel}</span></td>
                    <td>
                        ${company.aiRiskLevel === 'High' ? `<span class="rating-downgrade">${company.oldRating}</span>` : ''}
                        ${adjustedRating}
                    </td>
                    <td>${status}</td>
                </tr>
                <tr>
                    <td colspan="6" class="border-0 pt-0">
                        <div class="ps-3 mb-3">
                            <strong>Risk Factors:</strong> ${company.riskFactors.join(', ')}
                        </div>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        riskratingContent.innerHTML = html;
    }, 1000);
}

// Ask follow-up question
async function askFollowUpQuestion(question) {
    if (!currentCountry) return;
    
    // Get the AI content element
    const aiContent = document.getElementById('ai-content');
    
    // Show loading state
    aiContent.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Processing your question...</p></div>';
    
    try {
        const response = await fetch('/api/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                countryCode: currentCountry,
                question: question
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update AI content
        let html = `
            <div class="card mb-4">
                <div class="card-header">Follow-up Question</div>
                <div class="card-body">
                    <p class="fw-bold">${question}</p>
                    <p>${data.response}</p>
                </div>
            </div>
        `;
        
        // Add the original AI analysis back
        if (analysisData && analysisData.aiInsights) {
            html += `
                <div class="card mb-4">
                    <div class="card-header">Original AI Analysis</div>
                    <div class="card-body">
                        <div class="ai-analysis">
                            ${analysisData.aiInsights.analysis}
                        </div>
                    </div>
                </div>
            `;
        }
        
        aiContent.innerHTML = html;
        
    } catch (error) {
        console.error('Error asking follow-up question:', error);
        aiContent.innerHTML = '<p class="alert alert-danger">Failed to process your question. Please try again later.</p>';
    }
}

// Fetch and update economic charts
async function fetchEconomicCharts(countryCode) {
    try {
        // Fetch GDP data
        const gdpResponse = await fetch(`/api/gdp/${countryCode}`);
        if (gdpResponse.ok) {
            const gdpData = await gdpResponse.json();
            renderLineChart('gdp-chart', 'GDP Growth (%)', gdpData);
        }
        
        // Fetch unemployment data
        const unemploymentResponse = await fetch(`/api/unemployment/${countryCode}`);
        if (unemploymentResponse.ok) {
            const unemploymentData = await unemploymentResponse.json();
            renderLineChart('unemployment-chart', 'Unemployment Rate (%)', unemploymentData);
        }
        
        // Fetch comparison data
        const comparisonResponse = await fetch(`/api/comparison/${countryCode}`);
        if (comparisonResponse.ok) {
            const comparisonData = await comparisonResponse.json();
            renderComparisonChart('comparison-chart', 'GDP Growth Comparison (%)', comparisonData);
        }
    } catch (error) {
        console.error('Error fetching economic charts:', error);
    }
}

// Render line chart
function renderLineChart(chartId, label, data) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.name),
            datasets: [{
                label: label,
                data: data.map(item => item.value),
                borderColor: '#0071bc',
                backgroundColor: 'rgba(0, 113, 188, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Render comparison chart
function renderComparisonChart(chartId, label, data) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.name),
            datasets: [
                {
                    label: label,
                    data: data.map(item => item.value),
                    backgroundColor: 'rgba(0, 113, 188, 0.7)'
                },
                {
                    label: 'Average',
                    data: data.map(item => item.average),
                    type: 'line',
                    borderColor: '#dc3545',
                    borderWidth: 2,
                    pointBackgroundColor: '#dc3545',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// Render sentiment chart
function renderSentimentChart(sentiment) {
    const canvas = document.getElementById('sentiment-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [sentiment.positive, sentiment.neutral, sentiment.negative],
                backgroundColor: [
                    '#28a745',
                    '#6c757d',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });
}

// Show Risk Sense view
function showRiskSenseView(e) {
    e.preventDefault();
    
    // Update navigation
    riskSenseLink.classList.add('active');
    nibLink.classList.remove('active');
    
    // Update views
    riskSenseView.style.display = 'block';
    nibView.style.display = 'none';
}

// Show NIB view
function showNIBView(e) {
    e.preventDefault();
    
    // Update navigation
    riskSenseLink.classList.remove('active');
    nibLink.classList.add('active');
    
    // Update views
    riskSenseView.style.display = 'none';
    nibView.style.display = 'block';
    
    // Load NIB data if not already loaded
    if (nibContent.innerHTML === '') {
        fetchNIBData();
    }
}

// Fetch NIB recommendations
async function fetchNIBData() {
    try {
        // Show loading state
        nibLoadingState.style.display = 'flex';
        nibContent.style.display = 'none';
        
        const response = await fetch('/api/nib');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update NIB content
        updateNIBContent(data);
        
        // Hide loading, show content
        nibLoadingState.style.display = 'none';
        nibContent.style.display = 'block';
        
    } catch (error) {
        console.error('Error fetching NIB data:', error);
        nibLoadingState.style.display = 'none';
        nibContent.innerHTML = '<p class="alert alert-danger">Failed to load NIB recommendations. Please try again later.</p>';
        nibContent.style.display = 'block';
    }
}

// Update NIB content
function updateNIBContent(data) {
    if (!data) {
        nibContent.innerHTML = '<p class="alert alert-info">No NIB recommendations available.</p>';
        return;
    }
    
    const basic = data.basic;
    const aiRecommendations = data.aiRecommendations;
    
    // Build high-level info section
    let highlightsHtml = '';
    if (basic.yearInBrief.keyHighlights && basic.yearInBrief.keyHighlights.length > 0) {
        basic.yearInBrief.keyHighlights.forEach(highlight => {
            highlightsHtml += `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <div class="card-body text-center">
                            <h4 class="mb-3">${highlight.title}</h4>
                            <h2 class="display-5 text-primary mb-3">${highlight.value}</h2>
                            <p class="mb-0">${highlight.description}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    // Build fact sheets section
    let factSheetsHtml = '';
    if (basic.yearInBrief.factSheets && basic.yearInBrief.factSheets.length > 0) {
        factSheetsHtml = '<div class="row">';
        
        basic.yearInBrief.factSheets.forEach(factSheet => {
            factSheetsHtml += `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5>${factSheet.title}</h5>
                            <p>${factSheet.description}</p>
                            <a href="${factSheet.link}" target="_blank" class="btn btn-sm btn-outline-primary">View</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        factSheetsHtml += '</div>';
    }
    
    // Build quick links section
    let quickLinksHtml = '';
    if (basic.quickLinks && basic.quickLinks.length > 0) {
        quickLinksHtml = '<div class="quick-links">';
        
        basic.quickLinks.forEach(link => {
            quickLinksHtml += `
                <a href="${link.link}" target="_blank" class="quick-link-item">
                    <div class="quick-link-icon">📄</div>
                    <div class="quick-link-title">${link.title}</div>
                    <div class="quick-link-description">${link.description}</div>
                </a>
            `;
        });
        
        quickLinksHtml += '</div>';
    }
    
    // Build AI recommendations
    let aiRecommendationsHtml = '';
    
    if (aiRecommendations) {
        if (aiRecommendations.sustainable) {
            aiRecommendationsHtml += generateRecommendationCard(aiRecommendations.sustainable, 'Sustainable Finance');
        }
        
        if (aiRecommendations.infrastructure) {
            aiRecommendationsHtml += generateRecommendationCard(aiRecommendations.infrastructure, 'Infrastructure Development');
        }
        
        if (aiRecommendations.innovation) {
            aiRecommendationsHtml += generateRecommendationCard(aiRecommendations.innovation, 'Innovation Finance');
        }
    }
    
    // Combine all sections
    let html = `
        <div class="nib-section">
            <h3>${basic.yearInBrief.title}</h3>
            <p>${basic.yearInBrief.description}</p>
            
            <div class="row">
                ${highlightsHtml}
            </div>
            
            ${factSheetsHtml}
        </div>
        
        <div class="nib-section">
            <h3>Quick Links</h3>
            ${quickLinksHtml}
        </div>
        
        <div class="nib-section">
            <h3>AI-Generated Investment Recommendations</h3>
            <p class="mb-4">The following recommendations were generated using AI analysis of Nordic Investment Bank's focus areas and market opportunities.</p>
            
            ${aiRecommendationsHtml}
            
            <div class="model-disclaimer">
                <strong>Disclaimer:</strong> ${data.modelDisclaimer || 'These recommendations are AI-generated for informational purposes only and do not constitute financial advice.'}
            </div>
        </div>
    `;
    
    nibContent.innerHTML = html;
}

// Generate recommendation card
function generateRecommendationCard(recommendation, category) {
    // Determine risk level class
    let riskLevelClass = 'low';
    if (recommendation.riskLevel === 'Medium') {
        riskLevelClass = 'medium';
    } else if (recommendation.riskLevel === 'High') {
        riskLevelClass = 'high';
    }
    
    // Determine opportunity level class
    let opportunityLevelClass = 'low';
    if (recommendation.opportunityLevel === 'Medium') {
        opportunityLevelClass = 'medium';
    } else if (recommendation.opportunityLevel === 'High') {
        opportunityLevelClass = 'high';
    }
    
    return `
        <div class="recommendation-card">
            <div class="recommendation-header">
                <h4>${recommendation.title}</h4>
                <div class="text-white-50">${category} - ${recommendation.industry}</div>
            </div>
            <div class="recommendation-body">
                <div class="recommendation-detail">
                    <div class="rec-label">Description</div>
                    <div>${recommendation.description}</div>
                </div>
                
                <div class="risk-opportunity-indicators">
                    <div class="risk-indicator ${riskLevelClass.toLowerCase()}">
                        Risk: ${recommendation.riskLevel}
                    </div>
                    <div class="opportunity-indicator ${opportunityLevelClass.toLowerCase()}">
                        Opportunity: ${recommendation.opportunityLevel}
                    </div>
                </div>
                
                <div class="recommendation-detail">
                    <div class="rec-label">Analysis</div>
                    <div>${recommendation.analysis}</div>
                </div>
                
                <div class="recommendation-detail mb-0">
                    <div class="rec-label">Key Recommendation</div>
                    <div class="fw-bold">${recommendation.keyRecommendation}</div>
                </div>
            </div>
        </div>
    `;
}

// Show error message
function showError(message) {
    alert(message);
}