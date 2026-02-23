#!/usr/bin/env python3
"""Generate 5 sample RFP PDFs for BidCheck app demonstration."""

from fpdf import FPDF
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))


class RFP(FPDF):
    def __init__(self, title, issuer, ref):
        super().__init__()
        self.rfp_title = title
        self.issuer = issuer
        self.ref = ref

    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_fill_color(0, 70, 127)
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, f"  {self.issuer}  |  REQUEST FOR PROPOSAL  |  Ref: {self.ref}", fill=True, ln=True)
        self.set_text_color(0, 0, 0)
        self.ln(2)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f"CONFIDENTIAL  |  {self.rfp_title}  |  Page {self.page_no()}", align="C")

    def cover(self, subtitle, deadline, budget, contact):
        self.add_page()
        self.ln(15)
        self.set_font("Helvetica", "B", 22)
        self.set_text_color(0, 70, 127)
        self.set_x(self.l_margin)
        self.multi_cell(0, 12, self.rfp_title, align="C")
        self.ln(4)
        self.set_font("Helvetica", "", 14)
        self.set_text_color(60, 60, 60)
        self.set_x(self.l_margin)
        self.multi_cell(0, 9, subtitle, align="C")
        self.ln(10)
        self.set_draw_color(0, 70, 127)
        self.set_line_width(0.8)
        self.line(30, self.get_y(), 180, self.get_y())
        self.ln(8)
        self.set_font("Helvetica", "", 11)
        self.set_text_color(0, 0, 0)
        details = [
            ("Issuing Organisation", self.issuer),
            ("RFP Reference Number", self.ref),
            ("Submission Deadline", deadline),
            ("Estimated Contract Value", budget),
            ("Primary Contact", contact),
            ("Document Classification", "CONFIDENTIAL - For Authorised Recipients Only"),
        ]
        for label, value in details:
            self.set_font("Helvetica", "B", 11)
            self.cell(70, 8, label + ":", ln=False)
            self.set_font("Helvetica", "", 11)
            self.cell(0, 8, value, ln=True)
        self.ln(6)
        self.set_font("Helvetica", "I", 10)
        self.set_text_color(100, 100, 100)
        self.set_x(self.l_margin)
        self.multi_cell(0, 6,
            "This document is issued for the purpose of soliciting proposals from qualified vendors. "
            "Unauthorised disclosure or reproduction is strictly prohibited.")

    def section(self, title):
        self.ln(5)
        self.set_font("Helvetica", "B", 13)
        self.set_fill_color(0, 70, 127)
        self.set_text_color(255, 255, 255)
        self.cell(0, 8, f"  {title}", fill=True, ln=True)
        self.set_text_color(0, 0, 0)
        self.ln(2)

    def subsection(self, title):
        self.ln(3)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(0, 70, 127)
        self.cell(0, 7, title, ln=True)
        self.set_text_color(0, 0, 0)

    def body(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_x(self.l_margin)
        self.multi_cell(0, 6, text)
        self.ln(1)

    def bullets(self, items):
        self.set_font("Helvetica", "", 10)
        for item in items:
            self.set_x(self.l_margin)
            self.multi_cell(0, 6, "  - " + item)

    def table(self, headers, rows):
        self.set_font("Helvetica", "B", 9)
        self.set_fill_color(220, 230, 241)
        col_w = 190 // len(headers)
        for h in headers:
            self.cell(col_w, 7, h, border=1, fill=True)
        self.ln()
        self.set_font("Helvetica", "", 9)
        for i, row in enumerate(rows):
            fill = i % 2 == 0
            self.set_fill_color(245, 248, 252)
            for cell in row:
                self.cell(col_w, 6, str(cell), border=1, fill=fill)
            self.ln()
        self.ln(2)


# ─────────────────────────────────────────────────────────────────────────────
# RFP 1 - Cloud Migration
# ─────────────────────────────────────────────────────────────────────────────
def rfp_cloud_migration():
    pdf = RFP(
        "RFP: Enterprise Cloud Migration & Modernisation",
        "Global Insurance Group AG",
        "GIG-IT-2025-CM-047"
    )
    pdf.cover(
        subtitle="Migration of On-Premises Datacenter to Microsoft Azure\nPhase 1: Core Infrastructure & Application Workloads",
        deadline="30 September 2025, 17:00 CET",
        budget="EUR 4,200,000 - 6,800,000 (3-year programme)",
        contact="procurement@globalinsurancegroup.com",
    )

    pdf.add_page()
    pdf.section("1. Executive Summary & Background")
    pdf.body(
        "Global Insurance Group AG (GIG) operates across 14 European countries and manages over 8 million "
        "customer policies. Our current IT infrastructure consists of three owned datacenters located in "
        "Frankfurt, Warsaw and Zurich, hosting approximately 620 virtual machines, 18 TB of active data, "
        "and 47 line-of-business applications. "
        "The board has approved a strategic initiative to exit all owned datacenters by Q4 2027 and migrate "
        "all workloads to Microsoft Azure. This RFP covers Phase 1 of that programme, targeting the Frankfurt "
        "datacenter (240 VMs, 6 TB data, 19 applications)."
    )

    pdf.section("2. Scope of Work")
    pdf.subsection("2.1 Discovery & Assessment")
    pdf.bullets([
        "Full discovery of 240 VMs including dependency mapping using Azure Migrate or equivalent tooling",
        "Application portfolio assessment - classify each workload as Rehost, Replatform, Refactor or Retire",
        "Network topology documentation and Azure landing zone design",
        "Total Cost of Ownership (TCO) analysis and FinOps baseline establishment",
    ])
    pdf.subsection("2.2 Migration Execution")
    pdf.bullets([
        "Wave-based migration plan with defined rollback procedures for each wave",
        "Zero-downtime migration for Tier-1 applications (policy management, claims processing)",
        "Database migration: 4 x MS SQL Server 2019, 2 x Oracle 19c, 3 x PostgreSQL clusters",
        "Storage migration: Azure Blob for unstructured data, Azure Files for shared drives",
        "Network: ExpressRoute circuit provisioning (2 Gbps, redundant) from Frankfurt and Zurich",
    ])
    pdf.subsection("2.3 Security & Compliance")
    pdf.bullets([
        "ISO 27001 and DORA (Digital Operational Resilience Act) compliance throughout migration",
        "Implementation of Microsoft Defender for Cloud at Tier-2 or above",
        "Role-based access control redesign aligned to Azure AD (Entra ID)",
        "Data residency guarantee: all EU-regulated data must remain in EU Azure regions",
    ])

    pdf.section("3. Technical Requirements")
    pdf.table(
        ["Requirement ID", "Category", "Description", "Priority"],
        [
            ["TR-001", "Compute", "Azure VMware Solution or IaaS lift-and-shift for legacy VMs", "Must-Have"],
            ["TR-002", "Networking", "Hub-spoke landing zone with Azure Firewall Premium", "Must-Have"],
            ["TR-003", "Identity", "Hybrid identity with Entra ID Connect + PIM", "Must-Have"],
            ["TR-004", "Monitoring", "Azure Monitor + Sentinel SIEM integration", "Must-Have"],
            ["TR-005", "DR", "RPO <= 4 hours, RTO <= 8 hours for Tier-1 apps", "Must-Have"],
            ["TR-006", "FinOps", "Monthly cost reporting dashboard and anomaly alerts", "Should-Have"],
            ["TR-007", "Automation", "Infrastructure-as-Code (Bicep or Terraform)", "Should-Have"],
            ["TR-008", "Container", "AKS migration path for 3 containerisable apps", "Nice-to-Have"],
        ]
    )

    pdf.section("4. Vendor Evaluation Criteria")
    pdf.table(
        ["Criterion", "Weight", "Description"],
        [
            ["Technical Approach", "30%", "Quality of migration methodology and architecture"],
            ["Relevant Experience", "25%", "Similar financial/insurance sector cloud migrations"],
            ["Microsoft Partnership", "20%", "Partner tier, certifications, consumed Azure credits"],
            ["Price & Commercial Model", "15%", "Fixed-fee vs T&M, payment milestones, penalties"],
            ["Transition & Knowledge Transfer", "10%", "Documentation, training, hypercare period"],
        ]
    )

    pdf.section("5. Submission Requirements")
    pdf.bullets([
        "Executive summary (max 3 pages)",
        "Proposed solution architecture with diagrams",
        "Staffing plan: named resources with CVs, certifications (AZ-305, AZ-700 required)",
        "Detailed project plan with milestones and dependencies",
        "Three reference cases from insurance or financial sector (last 5 years)",
        "Fixed-price commercial proposal with breakdown per phase and optional items",
        "Completed Vendor Due Diligence Questionnaire (Annex A)",
    ])

    pdf.output(os.path.join(OUTPUT_DIR, "RFP_01_Cloud_Migration_GlobalInsuranceGroup.pdf"))
    print("Created RFP 1")


# ─────────────────────────────────────────────────────────────────────────────
# RFP 2 - Managed Services
# ─────────────────────────────────────────────────────────────────────────────
def rfp_managed_services():
    pdf = RFP(
        "RFP: IT Infrastructure Managed Services",
        "NordRetail AS",
        "NR-PROC-2025-MS-012"
    )
    pdf.cover(
        subtitle="End-to-End IT Operations Outsourcing\nHybrid Cloud & On-Premises Environment",
        deadline="15 October 2025, 12:00 CET",
        budget="NOK 28,000,000 - 38,000,000 per annum",
        contact="it-sourcing@nordretail.no",
    )

    pdf.add_page()
    pdf.section("1. Organisation Overview")
    pdf.body(
        "NordRetail AS is Norway's second-largest retail chain with 340 stores across Scandinavia, "
        "approximately 9,200 employees and annual revenue of NOK 14.2 billion. Our IT department supports "
        "a hybrid environment spanning Azure-hosted workloads, 340 store edge devices, central ERP "
        "(SAP S/4HANA), and a rapidly growing e-commerce platform. "
        "The current managed services contract expires on 31 March 2026. We are seeking a strategic partner "
        "to take over full IT operations management with a focus on service excellence, proactive monitoring "
        "and continuous improvement."
    )

    pdf.section("2. Service Scope")
    pdf.subsection("2.1 Service Tower: End-User Computing")
    pdf.bullets([
        "L1/L2/L3 service desk (Norwegian and English), target first-contact resolution >= 78%",
        "Device lifecycle management for 9,200 endpoints (Windows 11, iOS/Android)",
        "Microsoft 365 administration (Exchange Online, Teams, SharePoint, Intune)",
        "SCCM/Intune patch management - critical patches deployed within 48 hours",
    ])
    pdf.subsection("2.2 Service Tower: Infrastructure & Cloud Operations")
    pdf.bullets([
        "24x7 monitoring and incident management for Azure subscriptions (8 subscriptions, ~1,200 resources)",
        "On-premises datacenter operations: Oslo primary site, Bergen DR site",
        "Network operations: SD-WAN management across 340 stores, core campus and datacenters",
        "Backup and disaster recovery management - monthly DR test reporting required",
    ])
    pdf.subsection("2.3 Service Tower: SAP Basis Operations")
    pdf.bullets([
        "SAP S/4HANA 2023 basis administration (production, QA, development, sandbox landscapes)",
        "Transport management, system copies, performance tuning",
        "Coordination with SAP AMS partner for functional support",
    ])

    pdf.section("3. Service Level Requirements")
    pdf.table(
        ["Service", "Availability SLA", "P1 Response", "P1 Resolution"],
        [
            ["SAP Production", "99.9%", "15 min", "4 hours"],
            ["Azure Core Services", "99.8%", "15 min", "4 hours"],
            ["E-commerce Platform", "99.95%", "10 min", "2 hours"],
            ["Service Desk (P1)", "-", "Immediate", "1 hour"],
            ["Store Network", "99.5%", "30 min", "8 hours"],
        ]
    )

    pdf.section("4. Transition Requirements")
    pdf.body(
        "The incumbent provider must be transitioned out within a 90-day period. The successful vendor "
        "must provide a detailed transition plan covering knowledge transfer, tooling migration (ServiceNow "
        "instance migration), and parallel-run period. A dedicated Transition Manager is required for the "
        "full transition period. Financial penalties apply for any P1/P2 incidents during transition that "
        "are attributable to transition activities."
    )

    pdf.section("5. Mandatory Qualifications")
    pdf.bullets([
        "Microsoft Solutions Partner for Infrastructure (Azure) - Gold or above",
        "SAP Recognised Expertise in Technology (BASIS) certification",
        "ISO 20000-1 certification for IT Service Management",
        "ISO 27001 certification",
        "Documented experience managing retail sector IT operations at similar scale",
        "Norwegian-speaking L1/L2 service desk agents available 07:00-22:00 CET",
    ])

    pdf.output(os.path.join(OUTPUT_DIR, "RFP_02_Managed_Services_NordRetail.pdf"))
    print("Created RFP 2")


# ─────────────────────────────────────────────────────────────────────────────
# RFP 3 - Software Asset Management
# ─────────────────────────────────────────────────────────────────────────────
def rfp_sam():
    pdf = RFP(
        "RFP: Software Asset Management & License Optimisation",
        "Meridian Pharma Holdings",
        "MPH-SAM-2025-RFP-003"
    )
    pdf.cover(
        subtitle="Enterprise-Wide SAM Programme Implementation\nIncluding Microsoft, Oracle, SAP and Cloud SAAS",
        deadline="22 August 2025, 16:00 GMT",
        budget="GBP 850,000 - 1,400,000 (Year 1 implementation + 3-year managed SAM service)",
        contact="vendor.management@meridianpharma.com",
    )

    pdf.add_page()
    pdf.section("1. Background & Business Context")
    pdf.body(
        "Meridian Pharma Holdings (MPH) is a UK-headquartered specialty pharmaceutical company with "
        "operations in 22 countries and approximately 14,500 employees. Following a series of acquisitions "
        "over the past four years, MPH now operates a highly complex software estate with fragmented "
        "procurement, inconsistent licence tracking and significant compliance risk. "
        "An independent audit conducted in Q1 2025 identified an estimated under-licenced position of "
        "GBP 2.1M across Microsoft (EA/CSP), Oracle Database and SAP. The board has mandated an urgent "
        "SAM programme to establish compliance, reduce costs and implement sustainable governance."
    )

    pdf.section("2. Programme Objectives")
    pdf.bullets([
        "Achieve and maintain software licence compliance across all publishers within 12 months",
        "Deliver a minimum 20% reduction in software spend within 24 months through licence optimisation",
        "Implement a SAM tooling platform with real-time dashboards and automated harvesting",
        "Establish SAM governance framework including policies, processes and RACI",
        "Build internal capability through knowledge transfer - MPH aims to internalise SAM operations by Year 3",
    ])

    pdf.section("3. Publisher Scope")
    pdf.table(
        ["Publisher", "Products in Scope", "Est. Annual Spend", "Risk Level"],
        [
            ["Microsoft", "M365 E3/E5, Azure EA, Visual Studio, SQL Server, Windows Server", "GBP 3.2M", "HIGH"],
            ["Oracle", "Oracle DB EE, WebLogic, Java SE", "GBP 1.8M", "CRITICAL"],
            ["SAP", "S/4HANA, BW/4HANA, Concur, Ariba", "GBP 2.4M", "HIGH"],
            ["Adobe", "Creative Cloud, Acrobat DC, Sign", "GBP 420K", "MEDIUM"],
            ["Salesforce", "Sales Cloud, Service Cloud, MuleSoft", "GBP 780K", "MEDIUM"],
            ["Citrix", "Virtual Apps & Desktops, ADC", "GBP 310K", "LOW"],
        ]
    )

    pdf.section("4. Technical Requirements")
    pdf.subsection("4.1 SAM Tooling Platform")
    pdf.bullets([
        "Automated discovery covering on-premises, Azure, AWS and SaaS applications",
        "Integration with existing ITSM (ServiceNow), Active Directory and Azure AD",
        "Oracle LMS-compatible inventory data export capability",
        "Microsoft CIDC (Customer Inventory Data Collection) tool support",
        "API-first architecture for integration with procurement and finance systems",
        "Multi-tenancy support for 22-country entity structure",
    ])
    pdf.subsection("4.2 Managed SAM Service")
    pdf.bullets([
        "Quarterly software licence position reports for each major publisher",
        "Annual True-Up support and negotiation advisory for Microsoft EA renewal (due Jan 2027)",
        "Oracle audit defence support (vendor audit received October 2024, currently active)",
        "Proactive optimisation recommendations with business case modelling",
    ])

    pdf.section("5. Evaluation & Award Criteria")
    pdf.table(
        ["Criterion", "Score", "Key Questions"],
        [
            ["Oracle Audit Expertise", "25/100", "Specific Oracle audit defence case studies"],
            ["SAM Tool Capability", "20/100", "Demo of discovery depth and reporting"],
            ["Microsoft Licensing Expertise", "20/100", "EA/CSP/SPLA complexity handling"],
            ["Programme Methodology", "15/100", "Implementation approach and timeline"],
            ["Total Cost of Ownership", "15/100", "Year 1, Year 2, Year 3 cost modelling"],
            ["References", "5/100", "Pharma or life-sciences sector preferred"],
        ]
    )

    pdf.output(os.path.join(OUTPUT_DIR, "RFP_03_SAM_Optimisation_MeridianPharma.pdf"))
    print("Created RFP 3")


# ─────────────────────────────────────────────────────────────────────────────
# RFP 4 - Cybersecurity Services
# ─────────────────────────────────────────────────────────────────────────────
def rfp_cybersecurity():
    pdf = RFP(
        "RFP: Managed Security Operations & Cyber Resilience",
        "Bundesanstalt fuer Finanzdienstleistungsaufsicht (BaFin) - IT Division",
        "BFIN-CSOC-2025-017"
    )
    pdf.cover(
        subtitle="Managed Detection & Response (MDR) and Security Operations Centre (SOC)\nBaFin IT Infrastructure and Regulatory Systems",
        deadline="12 November 2025, 14:00 CET",
        budget="EUR 3,500,000 - 5,200,000 (4-year contract)",
        contact="it-ausschreibung@bafin.de",
    )

    pdf.add_page()
    pdf.section("1. Contracting Authority")
    pdf.body(
        "The Bundesanstalt fuer Finanzdienstleistungsaufsicht (BaFin) is the German federal financial "
        "supervisory authority, employing approximately 2,900 staff across Frankfurt, Bonn and Berlin. "
        "BaFin's IT environment hosts highly sensitive regulatory data, supervisory systems and "
        "communication infrastructure that are critical to the stability of the German financial system. "
        "This procurement is conducted under the EU Public Procurement Directive (2014/24/EU) and the "
        "German Public Procurement Regulation (VgV). All proposals must be submitted in German."
    )

    pdf.section("2. Scope of Services")
    pdf.subsection("2.1 Security Operations Centre (SOC)")
    pdf.bullets([
        "24x7x365 monitoring of all IT infrastructure using Microsoft Sentinel as primary SIEM",
        "Minimum 4 German-speaking Tier-2 analysts dedicated to BaFin environment",
        "Playbook-based automated response for defined incident categories",
        "Monthly threat intelligence briefings tailored to financial sector threats",
        "Integration with BaFin's existing Palo Alto Networks NGFW and CrowdStrike EDR",
    ])
    pdf.subsection("2.2 Managed Detection & Response")
    pdf.bullets([
        "Endpoint detection and response management across 3,200 endpoints",
        "Email security management (Microsoft Defender for Office 365 P2)",
        "Identity threat detection covering Entra ID and on-premises Active Directory",
        "Cloud security posture management for Azure and M365 tenant",
        "Monthly red team tabletop exercises (min. 4 per year)",
    ])
    pdf.subsection("2.3 Incident Response Retainer")
    pdf.bullets([
        "Minimum 200 pre-paid IR hours per annum",
        "4-hour on-site mobilisation SLA for Critical incidents (BaFin Frankfurt HQ)",
        "Forensic investigation capability including chain-of-custody evidence handling",
        "Post-incident reporting in format compatible with BSI IT-Grundschutz",
    ])

    pdf.section("3. Compliance & Legal Requirements")
    pdf.table(
        ["Requirement", "Standard/Regulation", "Mandatory?"],
        [
            ["Data residency", "All data processed exclusively in Germany", "Yes"],
            ["Personnel security", "Sicherheitsueberpruefung (SUe2) clearance eligible staff", "Yes"],
            ["ISMS certification", "ISO 27001 (scope must include SOC services)", "Yes"],
            ["BSI C5 attestation", "Type 2 report covering SOC platform", "Yes"],
            ["NIS2 compliance", "EU NIS2 Directive implementation evidence", "Yes"],
            ["Subcontracting", "Prior written approval required for any sub-processors", "Yes"],
        ]
    )

    pdf.section("4. Response Format")
    pdf.body(
        "All proposals must be submitted via the Vergabeplattform (DTVP) portal. Hard-copy submissions "
        "will not be accepted. The proposal must be structured in accordance with the provided Leistungsverzeichnis "
        "(LV) template (Annex B). Deviations from the template structure will result in exclusion from evaluation. "
        "Technical and commercial elements must be submitted as separate sealed documents."
    )

    pdf.output(os.path.join(OUTPUT_DIR, "RFP_04_Cybersecurity_SOC_BaFin.pdf"))
    print("Created RFP 4")


# ─────────────────────────────────────────────────────────────────────────────
# RFP 5 - Digital Workplace
# ─────────────────────────────────────────────────────────────────────────────
def rfp_digital_workplace():
    pdf = RFP(
        "RFP: Digital Workplace Transformation Programme",
        "Transcontinental Energy Corporation",
        "TEC-DW-2025-RFP-009"
    )
    pdf.cover(
        subtitle="Microsoft 365 E5 Rollout, Device Refresh & Modern Workplace Services\nGlobal Deployment: 23,000 Users Across 38 Countries",
        deadline="5 December 2025, 18:00 EST",
        budget="USD 12,000,000 - 18,500,000 (18-month programme + 2-year steady state)",
        contact="digital-workplace-rfp@tec-energy.com",
    )

    pdf.add_page()
    pdf.section("1. Programme Context")
    pdf.body(
        "Transcontinental Energy Corporation (TEC) is a NYSE-listed energy infrastructure company with "
        "operations spanning North America, Western Europe and Southeast Asia. TEC employs approximately "
        "23,000 staff globally and currently operates a highly fragmented workplace environment as a result "
        "of 11 acquisitions completed between 2018 and 2024. "
        "The Digital Workplace Programme aims to consolidate all employees onto a single Microsoft 365 E5 "
        "tenant, refresh 23,000 devices to Windows 11, and deliver a consistent, secure and productive "
        "digital experience. The programme must be completed before the existing multi-tenant EA agreements "
        "expire in June 2027."
    )

    pdf.section("2. Programme Scope")
    pdf.subsection("2.1 Tenant Consolidation")
    pdf.bullets([
        "Migration from 7 existing M365 tenants to single production tenant (TEC.com)",
        "Mailbox migration: 23,000 Exchange Online mailboxes",
        "SharePoint and OneDrive data migration: estimated 420 TB",
        "Teams telephony migration: 8,000 Direct Routing and Calling Plan users",
        "Azure AD/Entra ID consolidation with multi-forest AD synchronisation",
        "Identity governance: Entra ID Governance rollout including access reviews and entitlement management",
    ])
    pdf.subsection("2.2 Device Refresh & Management")
    pdf.bullets([
        "Supply and configuration of 23,000 Windows 11 devices (mix of laptops and desktops per Annex C)",
        "Autopilot deployment with zero-touch provisioning",
        "Intune MDM/MAM for Windows, iOS (4,200 devices) and Android (1,800 devices)",
        "Defender for Endpoint P2 deployment and configuration",
        "Managed print services rationalisation (currently 340 MFP devices)",
    ])
    pdf.subsection("2.3 Microsoft 365 E5 Activation")
    pdf.bullets([
        "Microsoft Teams Rooms deployment: 180 meeting rooms globally",
        "Microsoft Purview: Information Protection, DLP and compliance policies",
        "Copilot for Microsoft 365 pilot: 500 seats in Phase 1, business case for wider rollout",
        "Power Platform Centre of Excellence establishment",
        "Viva Suite activation: Viva Engage, Viva Insights and Viva Learning",
    ])

    pdf.section("3. Deployment Phasing")
    pdf.table(
        ["Phase", "Scope", "Users", "Duration", "Target Complete"],
        [
            ["0 - Foundation", "Tenant setup, security baseline, networking", "0", "8 weeks", "Q1 2026"],
            ["1 - Pilot", "NA HQ + EU HQ, Copilot pilot", "1,200", "10 weeks", "Q1 2026"],
            ["2 - North America", "US and Canada sites", "8,500", "14 weeks", "Q2 2026"],
            ["3 - Europe", "UK, DE, NL, FR, ES, NO", "7,800", "14 weeks", "Q3 2026"],
            ["4 - APAC & Others", "SG, AU, PH + 30 countries", "5,500", "16 weeks", "Q4 2026"],
        ]
    )

    pdf.section("4. Key Differentiators Sought")
    pdf.body(
        "TEC is specifically seeking a partner with demonstrable experience in large-scale multi-tenant "
        "consolidations. Vendors must provide at minimum two reference cases involving tenant mergers of "
        "more than 5,000 mailboxes. Given the energy sector context, the vendor must also demonstrate "
        "understanding of OT/IT boundary considerations and NERC CIP compliance requirements where applicable "
        "to IT systems. A dedicated global delivery lead with authority to make decisions without escalation "
        "is a non-negotiable requirement."
    )

    pdf.section("5. Commercial Requirements")
    pdf.bullets([
        "Fixed-price proposal for Phase 0 through Phase 4 implementation",
        "Itemised pricing for optional steady-state managed services (Years 3-5)",
        "Microsoft licensing advisory fees to be quoted separately (not bundled)",
        "Payment terms: milestone-based, maximum 30% upfront",
        "Performance bond of 10% of contract value required",
        "Liquidated damages: EUR 50,000 per week for delays exceeding 4 weeks per phase",
    ])

    pdf.output(os.path.join(OUTPUT_DIR, "RFP_05_Digital_Workplace_TranscontinentalEnergy.pdf"))
    print("Created RFP 5")


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    rfp_cloud_migration()
    rfp_managed_services()
    rfp_sam()
    rfp_cybersecurity()
    rfp_digital_workplace()
    print("\nAll 5 RFP PDFs generated successfully.")
