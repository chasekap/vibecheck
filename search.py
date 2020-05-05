import requests


API_KEY = "AIzaSyCOzm2amNVwqxRg2K0BUe59aOTXvhAgMXo" #pls don't query more than 25 times a day thnx 
SEARCH = "014749590020630390210:k5gghnyn2pt" #https://cse.google.com/cse/setup/basic?cx=014749590020630390210:k5gghnyn2pt

#currently queries Twitter,Reddit, Bruinwalk
def search(query):
    url = f"https://www.googleapis.com/customsearch/v1?key={API_KEY}&cx={SEARCH}&q={query}"
    data = requests.get(url).json()
    results = data['items']
    for result in results: 
        print(result['formattedUrl'])

search("Emacs")
search("Eggert UCLA")
