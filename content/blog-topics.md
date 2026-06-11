# Blog Topics Configuration

## pdf-extractor
**title:** Building a PDF Table Extractor
**subtitle:** Using Azure Document Intelligence for Automated Table Extraction
**badges:** Python,Azure,Document Intelligence

### Introduction
The PDF Table Extractor is a sophisticated Python application that leverages Azure Document Intelligence (formerly Form Recognizer) to automatically extract and process tabular data from PDF files. This tool streamlines the often complex process of table extraction, making it accessible through a user-friendly Streamlit interface.

### Architecture Overview
```architecture
PDF Upload → Streamlit UI Processing → Azure Document Intelligence Analysis → Table Extraction & Processing → Excel Generation & Download
```

### Implementation
#### Setup Steps
1. Clone the repository
   ```bash
   git clone https://github.com/subashkonar13/PDFTableReader.git
   ```
2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```
3. Configure Azure credentials

### For More Information
For detailed documentation, source code, and contribution guidelines, visit the project repository:
[View on GitHub](https://github.com/subashkonar13/PDFTableReader)

---

## azure-orkes
**title:** Azure Function & Orkes Integration
**subtitle:** Building Event-Driven Workflows with Azure Functions and Orkes Conductor
**badges:** Azure Functions,Orkes,Workflow,Python

### Introduction
This project demonstrates the integration between Azure Functions and Orkes Conductor (Netflix Conductor), creating an automated workflow that triggers when files are uploaded to Azure Blob Storage. The solution showcases how to build scalable, event-driven architectures using cloud services.

### Architecture Overview
```mermaid
graph LR
    A[Azure Blob Storage] -->|Trigger| B[Azure Function]
    B -->|Start Workflow| C[Orkes Conductor]
```

### Key Components
1. **Azure Function (function_app.py)**
   - Implements blob trigger for 'okesblob' container
   - Processes uploaded files
   - Extracts blob metadata
   - Initiates Orkes workflow

2. **Orkes Integration (orkes_call.py)**
   - Handles workflow execution
   - Manages authentication
   - Processes workflow responses

### For More Information
[View on GitHub](https://github.com/subashkonar13/Orkes-AzureConnector)

---

## jupyter-git-branch
**title:** Git Branch Management in Jupyter
**subtitle:** Dynamic Branch Switching and Code Execution in Notebook Environments
**badges:** Git,Jupyter,Python,Databricks

### Introduction
Managing different Git branches within Jupyter notebooks and Databricks environments is crucial for collaborative development and testing. This guide demonstrates how to dynamically switch between branches and execute code from specific branches within notebook environments.

### Implementation Methods
#### Method 1: Direct Package Installation from Branch
Install package directly from specific branch:
```python
%pip install --force-reinstall --no-deps git+https://<token>@github.com/<organisation>/<repo name>.git@<branch-name>
```

#### Method 2: Dynamic Installation with Environment Variables
```python
import os
token = os.getenv('GITHUB_TOKEN')
org = "myorganisation"
repo = "mypackage"
branch = "feature-branch"
%pip install --force-reinstall --no-deps git+https://{token}@github.com/{org}/{repo}.git@{branch}
```

### Best Practices
- Store tokens as environment variables, never hardcode them
- Use minimal required permissions for tokens
- Regularly rotate access tokens
- Clean up cloned repositories after use
- Use virtual environments for dependency isolation

### For More Information
[View on GitHub](https://github.com/subashkonar13/jupyter-git-branch-demo)

---

## instant-delivery
**title:** How Instant Delivery Aggregators Work
**subtitle:** Reverse-Engineering Quick-Commerce Price Comparison Apps
**badges:** Quick Commerce,APIs,Architecture

### Introduction
Instant-delivery price-comparison apps like QuickCompare show the price of the same product across Blinkit, Zepto, Swiggy Instamart, BigBasket, JioMart and DMart — plus each platform's delivery ETA and serviceability — on a single screen. None of these quick-commerce platforms publish a public API, so how do aggregators get that data? Based on a hands-on inspection of QuickCompare's live network traffic: they don't scrape HTML pages. The website is a thin client over their own backend aggregator, which calls each platform's private store-locator and catalog APIs, keyed by a per-location store ID.

### Architecture Overview
```architecture
User Location (lat/lon) → Aggregator Backend (api.quickcompare.in/qc) → Per-Platform Store Resolution → Store IDs → Per-Store Catalog & Price APIs → SKU Matching → Merged Price-Comparison Grid
```

### Key Findings
1. **The frontend is just a shell** — all product/price data comes from one backend endpoint switched by a `type` parameter (`geocode`, `home`, `autocomplete`, `search`).
2. **Location → store resolution** — lat/lon is mapped to each platform's internal dark-store ID (Blinkit numeric, Zepto UUID, Swiggy numeric).
3. **Store ID → stock & price** — the catalog API scoped to a store returns `available`/`price` as fields on each product object; there is no separate stock call.
4. **Request signing** — the backend is gated by an encrypted `x-request-id` header (auth/anti-scraping only); it does not decide which items you see — your geolocation does.

### Ethics & Legality
Inspecting network traffic in your own browser is benign. Replicating these internal APIs violates the platforms' Terms of Service, faces active bot defenses, and at scale is parasitic. Fine for personal/educational use at tiny volume; risky as a public commercial product.

### For More Information
General background (unaffiliated scraping vendors):
- [Web Scraping Blinkit, Zepto, Instamart, BigBasket](https://www.fooddatascrape.com/web-scraping-blinkit-zepto-instamart-and-big-basket-grocery-prices.php)
- [Understanding Quick Commerce Data APIs](https://www.foodspark.io/understanding-quick-commerce-data-apis/)
- [Price Comparison for Same SKUs](https://www.actowizsolutions.com/price-comparison-same-skus-blinkit-zepto-instamart.php)
