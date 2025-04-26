import { useState } from 'react'

const RegulationsPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleScrapeClick = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would dispatch the scrapeRegulations action
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Regulation scraping initiated. This would connect to the API in a production environment.')
    } catch (error) {
      console.error('Error scraping regulations:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Regulatory Intelligence</h1>
        <button
          onClick={handleScrapeClick}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Scraping...' : 'Scrape Regulations'}
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-medium mb-4">Recent Regulations</h2>
        <div className="border rounded-md p-8 text-center text-gray-500">
          <p>No regulations found yet.</p>
          <p className="mt-2 text-sm">Click "Scrape Regulations" to gather regulatory intelligence.</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-medium mb-4">Configured Regulatory Sources</h2>
        <ul className="space-y-3">
          <li className="flex justify-between border-b pb-2">
            <span className="font-medium">SEC</span>
            <a href="https://www.sec.gov/rules" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://www.sec.gov/rules
            </a>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span className="font-medium">FINRA</span>
            <a href="https://www.finra.org/rules-guidance" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://www.finra.org/rules-guidance
            </a>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">CFTC</span>
            <a href="https://www.cftc.gov/LawRegulation/index.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://www.cftc.gov/LawRegulation/index.htm
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default RegulationsPage 