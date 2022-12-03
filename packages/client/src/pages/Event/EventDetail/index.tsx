import { Space, Title } from '@mantine/core';
import { usePrevious } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import { useGetEventQuery } from '../../../store/services';
import EventDetailTable from './table';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetEventQuery({ id: id ?? '' });
  const [pointCoordinates, setPointCoordinates] = useState<[number, number] | undefined>(undefined);
  const [lineStringCoordinates, setLineStringCoordinates] = useState<LatLngExpression[] | undefined>(undefined);
  const previousError = usePrevious(error);

  useEffect(() => {
    const { type, coordinates } = data?.data?.geography ?? {};
    if (type === 'Point') {
      setPointCoordinates([coordinates[1], coordinates[0]]);
    } else if (type === 'LineString') {
      setLineStringCoordinates(coordinates?.map((c: [number, number]) => [c[1], c[0]]));
    }
  }, [data?.data?.geography]);

  useEffect(() => {
    if (error !== previousError)
      showNotification({ title: 'Error', message: 'Could not get data from the API', color: 'red' });
  }, [error, previousError]);

  const centerOfBc: LatLngExpression = [53.7267, -127.6476];

  return (
    <div>
      <Space h="lg" />
      <Title order={1}>Event Detail</Title>
      <Title order={6} c="dimmed">
        {id}
      </Title>
      <Space h="lg" />
      <EventDetailTable isLoading={isLoading} data={data?.data} />
      <Space h="lg" />
      <Title order={3}>Location</Title>
      <Space h="lg" />
      <MapContainer center={centerOfBc} zoom={5} scrollWheelZoom style={{ height: '800px', width: '100%' }}>
        <Map data={data} pointCoordinates={pointCoordinates} lineStringCoordinates={lineStringCoordinates} />
      </MapContainer>
      <Space h="lg" />
    </div>
  );
};

interface Props {
  data: any;
  pointCoordinates: any;
  lineStringCoordinates: any;
}

const Map = (props: Props) => {
  const map = useMap();
  const { data, pointCoordinates, lineStringCoordinates } = props;

  if (data?.data?.geography?.type === 'Point' && pointCoordinates) {
    map.flyTo(pointCoordinates, 15, { animate: false });
  } else if (data?.data?.geography?.type === 'LineString' && lineStringCoordinates) {
    map.fitBounds(lineStringCoordinates);
  }

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data?.data?.geography?.type === 'Point' && pointCoordinates && (
        <Marker position={pointCoordinates}>
          <Popup>Here it is</Popup>
        </Marker>
      )}
      {data?.data?.geography?.type === 'LineString' && lineStringCoordinates && (
        <Polyline color="red" positions={lineStringCoordinates} />
      )}
    </>
  );
};

export default EventDetail;
