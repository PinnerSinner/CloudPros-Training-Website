(() => {
    const grid = document.querySelector('[data-course-grid]');
    const cards = grid ? Array.from(grid.children) : [];
    const searchInput = document.getElementById('searchCourses');
    const providerFilter = document.getElementById('providerFilter');
    const trackFilter = document.getElementById('trackFilter');
    const levelFilter = document.getElementById('levelFilter');
    const emptyState = document.querySelector('[data-empty]');
    const previewDrawer = document.querySelector('[data-preview-drawer]');
    const previewTitle = document.querySelector('[data-preview-title]');
    const previewDescription = document.querySelector('[data-preview-description]');
    const previewHighlights = document.querySelector('[data-preview-highlights]');
    const previewModules = document.querySelector('[data-preview-modules]');
    const previewDuration = document.querySelector('[data-preview-duration]');
    const previewFormat = document.querySelector('[data-preview-format]');
    const previewPrice = document.querySelector('[data-preview-price]');
    const previewCadence = document.querySelector('[data-preview-cadence]');
    const previewDates = document.querySelector('[data-preview-dates]');
    const previewEnroll = document.querySelector('[data-preview-enroll]');
    const body = document.body;

    const courseDates = {
        'AWS Solutions Architect Sprint': ['July 8, 2024', 'August 12, 2024', 'September 9, 2024'],
        'Serverless Ops for AWS': ['July 15, 2024', 'August 19, 2024'],
        'Azure DevOps Accelerator': ['July 22, 2024', 'September 2, 2024'],
        'Azure AI Engineer Studio': ['August 5, 2024', 'September 16, 2024'],
        'GCP Data Engineering Studio': ['August 5, 2024', 'October 7, 2024'],
        'GCP Security Incident Lab': ['July 29, 2024', 'September 23, 2024'],
        'Cloud Security Zero-to-Hero': ['August 19, 2024', 'October 14, 2024'],
        'Multi-Cloud FinOps Leadership': ['September 2, 2024', 'November 4, 2024'],
        'Cloud Foundations Flight School': ['July 1, 2024', 'August 26, 2024'],
        'General Inquiry': ['Choose custom schedule'],
    };

    const courseDetails = {
        'AWS Solutions Architect Sprint': {
            overview:
                'A signature residency for senior engineers to design resilient, well-governed AWS foundations with executive-ready architecture narratives.',
            duration: '6 weeks · 12 live sessions',
            format: 'Live online · Instructor-led design labs',
            price: '$2,450 per participant · Volume pricing available',
            cadence: 'Meets Tuesdays & Thursdays with optional Saturday whiteboard labs.',
            durationHours: 2.5,
            modules: [
                'Kickoff: Well-Architected deep dive and business alignment',
                'Multi-account landing zone design and secure networking patterns',
                'Resiliency, disaster recovery, and data protection strategy',
                'Serverless and container orchestration integration labs',
                'Observability, cost governance, and operational excellence',
                'Capstone: Executive-ready architecture review with coaching',
            ],
            outcomes: [
                'Documented target-state reference architecture with risk register',
                'Three instructor critiques on workload-specific designs',
                'Practice assessment paths for the Solutions Architect Professional exam',
            ],
        },
        'Serverless Ops for AWS': {
            overview:
                'Build and operate production serverless systems with pragmatic observability, deployment, and FinOps guardrails.',
            duration: '4 weeks · 8 live sessions',
            format: 'Live online · Build-along lab environments',
            price: '$1,950 per participant',
            cadence: 'Evening cohorts meet Mondays & Wednesdays with Friday office hours.',
            durationHours: 2,
            modules: [
                'Event-driven design patterns with EventBridge and Step Functions',
                'Automated deployments with CDK, SAM, and GitHub Actions',
                'End-to-end observability using CloudWatch, X-Ray, and CloudTrail',
                'Cost and performance optimization for high-throughput workloads',
            ],
            outcomes: [
                'Reference pipelines for multi-stage serverless deployments',
                'Incident playbooks covering throttling, cold starts, and retries',
                'FinOps dashboards to monitor spend per feature and environment',
            ],
        },
        'Azure DevOps Accelerator': {
            overview:
                'Modernize your delivery toolchain with Azure DevOps, GitHub Advanced Security, and infrastructure automation best practices.',
            duration: '4 weeks · 8 live sessions',
            format: 'Hybrid live instruction + guided implementation sprints',
            price: '$1,990 per participant',
            cadence: 'Two 2-hour sessions per week plus optional enterprise clinics.',
            durationHours: 2,
            modules: [
                'Azure DevOps architecture and YAML migration strategy',
                'GitHub Actions and Azure Pipelines for multi-stage delivery',
                'IaC with Bicep/Terraform and policy-driven governance',
                'Secure supply chain with defender integrations and quality gates',
            ],
            outcomes: [
                'Modern deployment pipeline template ready for production teams',
                'Governance-as-code guardrails for approvals, secrets, and drift',
                'Operational scorecard measuring deployment frequency & MTTR',
            ],
        },
        'Azure AI Engineer Studio': {
            overview:
                'Ship trustworthy AI services on Azure with applied prompt engineering, vector search, and responsible AI oversight.',
            duration: '5 weeks · 10 live sessions',
            format: 'Live studio workshops + sandbox experimentation',
            price: '$2,600 per participant',
            cadence: 'Meets Tuesdays & Thursdays with Saturday model clinic.',
            durationHours: 2.5,
            modules: [
                'Generative AI solution framing and success measurement',
                'Prompt orchestration with Azure OpenAI and function calling',
                'Enterprise search with Cognitive Search, vector stores, and grounding',
                'Responsible AI controls, monitoring, and compliance workflows',
                'Deployment blueprints for copilots and conversational agents',
            ],
            outcomes: [
                'Reference implementation for an internal AI assistant',
                'Bias and safety checklist tailored to your governance needs',
                'Operational dashboards to monitor usage, quality, and drift',
            ],
        },
        'GCP Data Engineering Studio': {
            overview:
                'Design resilient data platforms on Google Cloud with live ingestion, transformation, and ML activation labs.',
            duration: '5 weeks · 10 live sessions',
            format: 'Hands-on cohort · Lab-first delivery',
            price: '$2,550 per participant',
            cadence: 'Meets Mondays & Wednesdays with optional Friday data clinics.',
            durationHours: 2.5,
            modules: [
                'Landing streaming & batch pipelines with Pub/Sub and Dataflow',
                'Warehouse modeling and performance tuning in BigQuery',
                'Data quality automation with Dataform and Data Catalog',
                'ML pipeline activation with Vertex AI and Looker dashboards',
                'Capstone: Near-real-time analytics lakehouse implementation',
            ],
            outcomes: [
                'Reusable ingestion blueprints and Terraform modules',
                'Data reliability scorecards with automated alerts',
                'Executive-ready metrics narrative linking data to business KPIs',
            ],
        },
        'GCP Security Incident Lab': {
            overview:
                'Sharpen response skills with immersive Chronicle investigations, automation drills, and BeyondCorp implementation.',
            duration: '3 weeks · 6 live simulations',
            format: 'Scenario-based · War-room exercises',
            price: '$1,750 per participant',
            cadence: 'Meets twice weekly with asynchronous purple-team challenges.',
            durationHours: 2,
            modules: [
                'Threat detection with Security Command Center and Chronicle',
                'Automated policy enforcement with Config Validator and Forseti',
                'Identity-aware proxying and BeyondCorp architecture labs',
                'Coordinated incident response tabletop and communications',
            ],
            outcomes: [
                'Documented incident runbooks with escalation paths',
                'Automation scripts for containment and policy remediation',
                'Executive debrief template for board-ready reporting',
            ],
        },
        'Cloud Security Zero-to-Hero': {
            overview:
                'Unify security operations across AWS, Azure, and GCP with compliance automation, SIEM integration, and SOC readiness.',
            duration: '6 weeks · 12 live sessions',
            format: 'Live multi-cloud bootcamp + lab environment',
            price: '$2,700 per participant',
            cadence: 'Twice-weekly deep dives plus rotating capture-the-flag drills.',
            durationHours: 2.5,
            modules: [
                'Cloud threat landscape and shared responsibility modeling',
                'Identity, access, and secrets hardening across providers',
                'Compliance-as-code for PCI, HIPAA, and SOC 2 benchmarks',
                'SIEM automation with Sentinel, Chronicle, and Security Lake',
                'Incident command simulations and executive communications',
            ],
            outcomes: [
                'Multi-cloud security architecture workbook and maturity roadmap',
                'Hands-on labs covering SIEM enrichment and playbook automation',
                'Readiness assessment aligned to your regulatory obligations',
            ],
        },
        'Multi-Cloud FinOps Leadership': {
            overview:
                'Equip finance and engineering leaders to drive accountable cloud spend with storytelling, guardrails, and culture design.',
            duration: '3 weeks · 6 live sessions',
            format: 'Executive workshops + collaborative labs',
            price: '$2,100 per participant',
            cadence: 'Meets weekly with action labs and peer roundtables.',
            durationHours: 1.5,
            modules: [
                'FinOps foundations and maturity benchmarking',
                'Cost allocation, showback, and automated budget guardrails',
                'Executive storytelling with Looker, Power BI, and tailored scorecards',
                'Change management playbooks and success metrics',
            ],
            outcomes: [
                'Quarterly executive dashboard templates and communication cadence',
                'Policy starter kit for budgets, commitments, and anomaly response',
                'Culture activation plan with stakeholder roles and quick wins',
            ],
        },
        'Cloud Foundations Flight School': {
            overview:
                'Fast-track new practitioners with universal concepts, guided labs, and certification-aligned study paths across AWS, Azure, and GCP.',
            duration: '2 weeks · 4 live sessions',
            format: 'Live primers + self-paced lab boosts',
            price: '$1,150 per participant',
            cadence: 'Meets twice weekly with on-demand sandbox challenges.',
            durationHours: 1.5,
            modules: [
                'Global infrastructure, shared responsibility, and governance basics',
                'Hands-on compute, storage, and networking primers',
                'Security, identity, and monitoring essentials',
                'Certification planning and next-step learning journeys',
            ],
            outcomes: [
                'Cloud lexicon and decision framework for new teams',
                'Hands-on practice environment with guided challenges',
                'Personalized certification study plan for AWS, Azure, and GCP fundamentals',
            ],
        },
    };

    if (window.CloudPros) {
        Object.entries(courseDates).forEach(([name, dates]) => window.CloudPros.registerDates(name, dates));
    }

    const applyFilters = () => {
        const searchTerm = searchInput?.value.toLowerCase().trim() ?? '';
        const provider = providerFilter?.value ?? 'all';
        const track = trackFilter?.value ?? 'all';
        const level = levelFilter?.value ?? 'all';
        let visibleCount = 0;

        cards.forEach((card) => {
            const matchesSearch = searchTerm
                ? card.textContent.toLowerCase().includes(searchTerm)
                : true;
            const matchesProvider = provider === 'all' || card.dataset.provider === provider;
            const matchesTrack = track === 'all' || card.dataset.track === track;
            const matchesLevel = level === 'all' || card.dataset.level === level;
            const isVisible = matchesSearch && matchesProvider && matchesTrack && matchesLevel;
            card.style.display = isVisible ? '' : 'none';
            if (isVisible) visibleCount += 1;
        });

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    };

    searchInput?.addEventListener('input', applyFilters);
    providerFilter?.addEventListener('change', applyFilters);
    trackFilter?.addEventListener('change', applyFilters);
    levelFilter?.addEventListener('change', applyFilters);

    applyFilters();

    const openPreview = (card) => {
        if (!previewDrawer || !card) return;
        const title = card.querySelector('h2')?.textContent?.trim() ?? '';
        const description = card.querySelector('p')?.textContent?.trim() ?? '';
        const highlights = Array.from(card.querySelectorAll('ul li')).map((item) => item.textContent.trim());
        const details = courseDetails[title];

        if (previewTitle) previewTitle.textContent = title;
        if (previewDescription) previewDescription.textContent = details?.overview ?? description;

        const applyMeta = (element, value) => {
            if (!element) return;
            if (value) {
                element.textContent = value;
                element.removeAttribute('hidden');
            } else {
                element.textContent = '';
                element.setAttribute('hidden', '');
            }
        };

        applyMeta(previewDuration, details?.duration);
        applyMeta(previewFormat, details?.format);
        applyMeta(previewPrice, details?.price);
        if (previewCadence) {
            if (details?.cadence) {
                previewCadence.textContent = details.cadence;
                previewCadence.removeAttribute('hidden');
            } else {
                previewCadence.textContent = '';
                previewCadence.setAttribute('hidden', '');
            }
        }

        if (previewModules) {
            previewModules.innerHTML = '';
            const modules = details?.modules ?? [];
            if (modules.length) {
                modules.forEach((module) => {
                    const li = document.createElement('li');
                    li.textContent = module;
                    previewModules.append(li);
                });
            }
        }

        if (previewHighlights) {
            const outcomes = details?.outcomes?.length ? details.outcomes : highlights;
            previewHighlights.innerHTML = '';
            outcomes.forEach((highlight) => {
                const li = document.createElement('li');
                li.textContent = highlight;
                previewHighlights.append(li);
            });
        }

        if (previewDates) {
            previewDates.innerHTML = '';
            const schedule = courseDates[title] ?? [];
            if (schedule.length) {
                schedule.forEach((dateText) => {
                    const li = document.createElement('li');
                    li.classList.add('preview-drawer__date');
                    const dateLabel = document.createElement('span');
                    dateLabel.textContent = dateText;
                    li.append(dateLabel);

                    const linksWrap = document.createElement('div');
                    linksWrap.classList.add('preview-drawer__date-links');
                    const calendarLinks = window.CloudPros.getCalendarLinks(title, dateText, {
                        durationHours: details?.durationHours,
                        details: `CloudPros ${title} live cohort kickoff. Sessions include guided labs and coaching.`,
                    });

                    const googleLink = document.createElement('a');
                    googleLink.textContent = 'Google';
                    googleLink.classList.add('calendar-link', 'calendar-link--google');
                    googleLink.target = '_blank';
                    googleLink.rel = 'noopener';

                    const icsLink = document.createElement('a');
                    icsLink.textContent = '.ics';
                    icsLink.classList.add('calendar-link', 'calendar-link--ics');

                    if (calendarLinks) {
                        googleLink.href = calendarLinks.google;
                        icsLink.href = calendarLinks.outlook;
                        icsLink.download = `${calendarLinks.slug}.ics`;
                    } else {
                        googleLink.href = '#';
                        googleLink.classList.add('is-disabled');
                        googleLink.setAttribute('aria-disabled', 'true');
                        icsLink.href = '#';
                        icsLink.classList.add('is-disabled');
                        icsLink.setAttribute('aria-disabled', 'true');
                    }

                    linksWrap.append(googleLink, icsLink);
                    li.append(linksWrap);
                    previewDates.append(li);
                });
            } else {
                const li = document.createElement('li');
                li.classList.add('preview-drawer__no-dates');
                li.textContent = 'Custom schedule on request — cohorts launch monthly.';
                previewDates.append(li);
            }
        }

        if (previewEnroll) {
            previewEnroll.setAttribute('data-enroll', title);
            previewEnroll.textContent = `Reserve ${title}`;
        }

        previewDrawer.classList.add('open');
        body.style.overflow = 'hidden';
    };

    const closePreview = () => {
        if (!previewDrawer) return;
        previewDrawer.classList.remove('open');
        body.style.overflow = '';
    };

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.matches('[data-preview]')) {
            const card = target.closest('.course-card');
            openPreview(card);
        }
        if (target.matches('[data-close-preview]')) {
            closePreview();
        }
    });

    previewDrawer?.addEventListener('click', (event) => {
        if (event.target === previewDrawer) {
            closePreview();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closePreview();
        }
    });
})();
