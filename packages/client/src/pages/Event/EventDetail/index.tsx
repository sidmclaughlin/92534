import { Space, Title } from '@mantine/core';
import { usePrevious } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetEventQuery } from '../../../store/services';
import EventDetailTable from './table';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetEventQuery({ id: id ?? '' });
  const previousError = usePrevious(error);

  useEffect(() => {
    if (error !== previousError)
      showNotification({ title: 'Error', message: 'Could not get data from the API', color: 'red' });
  }, [error, previousError]);

  return (
    <div>
      <Space h="lg" />
      <Title order={1}>Event Detail</Title>
      <Title order={6} c="dimmed">
        {id}
      </Title>
      <Space h="lg" />
      <EventDetailTable isLoading={isLoading} data={data?.data} />
    </div>
  );
};

export default EventDetail;
