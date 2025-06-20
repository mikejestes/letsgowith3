import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Button,
  Card,
  SimpleGrid,
  Group,
  Center,
  Stack,
  TextInput,
  Modal,
} from '@mantine/core';
import { Spade, Users, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = () => {
    if (userName.trim()) {
      const newRoomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      navigate(`/room/${newRoomId}?name=${encodeURIComponent(userName.trim())}`);
    }
  };

  const handleJoinRoom = () => {
    if (userName.trim() && roomId.trim()) {
      navigate(`/room/${roomId.trim()}?name=${encodeURIComponent(userName.trim())}`);
    }
  };
  return (
    <Container size="lg" py="xl">
      <Center>
        <Stack align="center" gap="xl">
          <div style={{ textAlign: 'center' }}>
            <Title order={1} size={60} mb="md">
              🎭 PokerVibes
            </Title>
            <Text size="xl" c="dimmed" mb="xl">
              Multi-player team estimation tool for agile planning
            </Text>
          </div>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
            <Card shadow="md" padding="lg" radius="md" withBorder>
              <Stack align="center" gap="md">
                <Spade size={48} color="blue" />
                <Title order={3}>Estimate Stories</Title>
                <Text size="sm" c="dimmed" ta="center">
                  Collaboratively estimate user stories with your team
                </Text>
                <Text size="xs" c="dimmed" ta="center">
                  Use planning poker techniques to reach consensus on story
                  points
                </Text>
              </Stack>
            </Card>

            <Card shadow="md" padding="lg" radius="md" withBorder>
              <Stack align="center" gap="md">
                <Users size={48} color="green" />
                <Title order={3}>Team Collaboration</Title>
                <Text size="sm" c="dimmed" ta="center">
                  Remote-friendly estimation sessions
                </Text>
                <Text size="xs" c="dimmed" ta="center">
                  Perfect for distributed teams and video calls
                </Text>
              </Stack>
            </Card>

            <Card shadow="md" padding="lg" radius="md" withBorder>
              <Stack align="center" gap="md">
                <BarChart3 size={48} color="orange" />
                <Title order={3}>Consensus Building</Title>
                <Text size="sm" c="dimmed" ta="center">
                  Blind voting prevents anchoring bias
                </Text>
                <Text size="xs" c="dimmed" ta="center">
                  Everyone votes simultaneously for unbiased estimates
                </Text>
              </Stack>
            </Card>
          </SimpleGrid>

          <Group gap="md">
            <Button size="lg" variant="filled" onClick={() => setCreateModalOpen(true)}>
              Start a Session
            </Button>
            <Button size="lg" variant="outline" onClick={() => setJoinModalOpen(true)}>
              Join a Session
            </Button>
          </Group>

          <Text size="sm" c="dimmed">
            No registration required • Free to use
          </Text>

          <Card shadow="md" padding="xl" radius="md" withBorder mt="xl">
            <Stack align="center" gap="md">
              <Title order={2}>Welcome to PokerVibes! 🎉</Title>
              <Text c="dimmed" ta="center">
                Your agile estimation companion
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Built with React, React Router, and Mantine for a modern,
                responsive experience.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Center>

      {/* Create Room Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Start a New Session"
      >
        <Stack gap="md">
          <TextInput
            label="Your Name"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRoom} disabled={!userName.trim()}>
              Create Room
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Join Room Modal */}
      <Modal
        opened={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join a Session"
      >
        <Stack gap="md">
          <TextInput
            label="Your Name"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <TextInput
            label="Room ID"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoinRoom} disabled={!userName.trim() || !roomId.trim()}>
              Join Room
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
