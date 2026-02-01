import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HostCreation from './components/host/HostCreation.jsx';
import ReceiverPage from './pages/ReceiverPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HostCreation />} />
        <Route path="/v/:id" element={<ReceiverPage />} />
        <Route path="/r/:id" element={<ResultsPage />} />
        <Route path="*" element={<HostCreation />} />
      </Routes>
    </BrowserRouter>
  );
}
