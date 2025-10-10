import requests
from bs4 import BeautifulSoup

async def scrape_example(url: str):
    """Simple async scraping example"""
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")
    title = soup.find("title").text if soup.find("title") else "No title found"
    return {"url": url, "title": title}
