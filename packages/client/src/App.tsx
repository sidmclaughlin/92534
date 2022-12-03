import { Container } from '@mantine/core';
import { Navigate, Route, Routes } from 'react-router-dom';
import EventDetail from './pages/Event/EventDetail';
import EventList from './pages/Event/EventList';

const App = () => (
  <Container size="xl">
    <Routes>
      <Route path="/" element={<Navigate to="/events" />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/events" element={<EventList />} />
    </Routes>
  </Container>
);

export default App;
