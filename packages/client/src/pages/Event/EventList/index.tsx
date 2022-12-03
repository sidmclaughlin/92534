import { Badge, Box, Grid, MultiSelect, Select, Space, Text, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { usePrevious } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAreasQuery, useGetEventsQuery } from '../../../store/services';

const PAGE_SIZES = [10, 25, 50, 100];

const EventList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZES[0]);

  const [areaFilterValues, setAreaFilterValues] = useState<string[]>([]);
  const [severityFilterValues, setSeverityFilterValues] = useState<string[]>([]);
  const [eventTypeFilterValues, setEventTypeFilterValues] = useState<string[]>([]);

  const [startDateMetaValue, setStartDateMetaValue] = useState<'<' | '>' | ''>('');
  const [startDateFilterValue, setStartDateFilterValue] = useState<Date | null>(null);

  const { data, error, isLoading } = useGetEventsQuery({
    limit,
    offset,
    area_id: areaFilterValues.join(','),
    severity: severityFilterValues.join(','),
    event_type: eventTypeFilterValues.join(','),
    start_date:
      startDateMetaValue != null && startDateFilterValue != null
        ? `${startDateMetaValue}${startDateFilterValue.toISOString().substring(0, 10)}`
        : '',
  });
  const previousError = usePrevious(error);

  const { data: areaData } = useGetAreasQuery();

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
      {/* Filters */}
      <Space h="lg" />
      <Grid>
        <Grid.Col span={3}>
          <MultiSelect
            onChange={(value) => setAreaFilterValues(value)}
            label="Area(s)"
            data={(areaData?.data ?? []).map((a: Record<string, any>) => ({ value: a.id, label: a.name }))}
            value={areaFilterValues}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <MultiSelect
            onChange={(value) => setSeverityFilterValues(value)}
            label="Severity"
            data={['MAJOR', 'MODERATE', 'MINOR', 'UNKNOWN']}
            value={severityFilterValues}
          />
        </Grid.Col>

        <Grid.Col span={3}>
          <MultiSelect
            onChange={(value) => setEventTypeFilterValues(value)}
            label="Event Type"
            data={['CONSTRUCTION', 'INCIDENT', 'ROAD_CONDITION', 'SPECIAL_EVENT', 'WEATHER_CONDITION']}
            value={eventTypeFilterValues}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Start Date"
                placeholder="Select something"
                value={startDateMetaValue}
                onChange={setStartDateMetaValue}
                data={[
                  { value: '', label: 'Exact' },
                  { value: '<', label: 'Before' },
                  { value: '>', label: 'After' },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePicker
                inputFormat="YYYY-MM-DD"
                label=" "
                value={startDateFilterValue}
                onChange={setStartDateFilterValue}
              />
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
      {/* DataTable */}
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
