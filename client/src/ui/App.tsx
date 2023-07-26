import './App.css'
import ImageUploadForm from './ImageUploadForm.tsx'
import ImageGallery from './ImageGallery.tsx'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()
function App() {
  return (
      <div>
          <QueryClientProvider client={queryClient}>
          <ImageUploadForm />
          <ImageGallery />
          </QueryClientProvider>
      </div>
  )
}

export default App
