import { useState, useEffect } from 'react';
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
import { Spade, Users, BarChart3, Rocket } from 'lucide-react';
import { nameUtils } from '../utils/nameUtils';
import { generateRoomId } from '../utils/roomNameGenerator';

export default function HomePage() {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');

  // Load saved username from localStorage on component mount
  useEffect(() => {
    const savedName = nameUtils.getStoredName();
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleCreateRoom = () => {
    if (userName.trim()) {
      // Save username to localStorage
      nameUtils.saveName(userName.trim());
      const newRoomId = generateRoomId();
      navigate(`/room/${newRoomId}?name=${encodeURIComponent(userName.trim())}`);
    }
  };

  const handleJoinRoom = () => {
    if (userName.trim() && roomId.trim()) {
      // Save username to localStorage
      nameUtils.saveName(userName.trim());
      navigate(`/room/${roomId.trim()}?name=${encodeURIComponent(userName.trim())}`);
    }
  };

  const handleQuickCreateRoom = () => {
    if (userName.trim()) {
      // Save username to localStorage
      nameUtils.saveName(userName.trim());
      const newRoomId = generateRoomId();
      navigate(`/room/${newRoomId}?name=${encodeURIComponent(userName.trim())}`);
    } else {
      setCreateModalOpen(true);
    }
  };

  const handleQuickJoinRoom = () => {
    if (userName.trim()) {
      setJoinModalOpen(true);
    } else {
      setJoinModalOpen(true);
    }
  };

  const handleUserNameChange = (value: string) => {
    setUserName(value);
    // Save to localStorage as user types
    nameUtils.saveName(value);
  };
  return (
    <Container size="lg" py="xl">
      <Center>
        <Stack align="center" gap="xl">
          <div style={{ textAlign: 'center' }}>
            <Group justify="center" align="center" gap="md" mb="md">
              <Rocket size={48} color="#228be6" />
              <Title order={1} size={60}>
                lets go with 3
              </Title>
            </Group>
            <Text size="xl" c="dimmed" mb="xl">
              the very serious engineers pointing poker app
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
            {userName.trim() ? (
              <Stack align="center" gap="xs">
                <Text size="sm" c="dimmed">
                  Welcome back, <strong>{userName}</strong>!
                </Text>
                <Group gap="sm">
                  <Button size="lg" variant="filled" onClick={handleQuickCreateRoom}>
                    Start a Session
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleQuickJoinRoom}>
                    Join a Session
                  </Button>
                </Group>
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => {
                    nameUtils.clearName();
                    setUserName('');
                  }}
                >
                  Use different name
                </Button>
              </Stack>
            ) : (
              <>
                <Button size="lg" variant="filled" onClick={() => setCreateModalOpen(true)}>
                  Start a Session
                </Button>
                <Button size="lg" variant="outline" onClick={() => setJoinModalOpen(true)}>
                  Join a Session
                </Button>
              </>
            )}
          </Group>

          <Text size="sm" c="dimmed">
            No registration required • Free to use
          </Text>

          <Card shadow="md" padding="xl" radius="md" withBorder mt="xl">
            <Stack align="center" gap="md">
              <Title order={2}>Welcome to lets go with 3! 🎉</Title>
              <Text c="dimmed" ta="center">
                the very serious engineers pointing poker app
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
            onChange={(e) => handleUserNameChange(e.target.value)}
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
            onChange={(e) => handleUserNameChange(e.target.value)}
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
