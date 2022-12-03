import { Badge, Box, Space, Text, Title } from '@mantine/core';
import { usePrevious } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetEventsQuery } from '../../../store/services';

const PAGE_SIZES = [10, 25, 50, 100];

const EventList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZES[0]);

  const { data, error, isLoading } = useGetEventsQuery({ limit, offset });
  const previousError = usePrevious(error);

  useEffect(() => {
    if (error !== previousError)
      showNotification({ title: 'Error', message: 'Could not get data from the API', color: 'red' });
  }, [error, previousError]);

  useEffect(() => {
    const { limit } = data?.pagination ?? { limit: 50, offset: 0 };

    setOffset(limit * page - limit);
  }, [page, data?.pagination]);

  useEffect(() => {
    setPage(1);
  }, [limit]);

  return (
    <div>
      <Space h="lg" />
      <Title order={1}>Event List</Title>
      <Space h="lg" />
      <DataTable
        onRowClick={({ id }) => navigate(id)}
        onPageChange={(page: number) => setPage(page)}
        onRecordsPerPageChange={setLimit}
        withBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        minHeight={100}
        recordsPerPage={limit}
        recordsPerPageOptions={PAGE_SIZES}
        totalRecords={data?.pagination?.count ?? 0}
        page={page}
        fetching={isLoading}
        records={data?.data}
        columns={[
          {
            accessor: 'status',
            render: ({ status }) => <Text title={status}>{status}</Text>,
          },
          {
            accessor: 'severity',
            render: ({ severity }) => {
              const color: string =
                ({ MAJOR: 'red', MODERATE: 'yellow', MINOR: 'green', UNKNOWN: 'gray' } as Record<string, any>)[
                  severity
                ] || 'black';

              return (
                <Text weight={700} color={color} title={severity}>
                  {severity}
                </Text>
              );
            },
          },
          {
            accessor: 'event_type',
            title: 'Event Type',
            render: ({ event_type }) => (
              <Text lineClamp={1} title={event_type.replace('_', '')}>
                {event_type.replace('_', ' ')}
              </Text>
            ),
          },
          {
            accessor: 'event_subtypes',
            title: 'Event Subtypes',
            render: ({ event_subtypes }) => (
              <Box title={event_subtypes.map((e: string) => e.replace('_', ' ')).join(',')}>
                {event_subtypes.map((e: string) => (
                  <Badge key={e}>{e.replace('_', ' ')}</Badge>
                ))}
              </Box>
            ),
          },
          {
            accessor: 'headline',
            render: ({ headline }) => (
              <Text lineClamp={1} title={headline.replace('_', ' ')}>
                {headline.replace('_', ' ')}
              </Text>
            ),
          },
          {
            accessor: 'description',
            render: ({ description }) => (
              <Text lineClamp={1} title={description}>
                {description}
              </Text>
            ),
          },
        ]}
      />
    </div>
  );
};

export default EventList;
