import { Badge, Box, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

interface Props {
  isLoading: boolean;
  data?: Record<string, any>;
}

const EventDetailTable = ({ isLoading, data }: Props) => (
  <DataTable
    withBorder
    borderRadius="sm"
    withColumnBorders
    striped
    highlightOnHover
    minHeight={100}
    fetching={isLoading}
    records={data ? [data] : []}
    columns={[
      {
        accessor: 'status',
        render: ({ status }) => <Text title={status}>{status}</Text>,
      },
      {
        accessor: 'severity',
        render: ({ severity }) => {
          const color: string =
            ({ MAJOR: 'red', MODERATE: 'yellow', MINOR: 'green', UNKNOWN: 'gray' } as Record<string, any>)[severity] ||
            'black';

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
        render: ({ event_type }) => <Text title={event_type.replace('_', '')}>{event_type.replace('_', ' ')}</Text>,
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
        render: ({ headline }) => <Text title={headline.replace('_', ' ')}>{headline.replace('_', ' ')}</Text>,
      },
      {
        accessor: 'description',
        render: ({ description }) => <Text title={description}>{description}</Text>,
      },
    ]}
  />
);

export default EventDetailTable;
