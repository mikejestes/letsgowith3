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
} from '@mantine/core';
import { IconCards, IconUsers, IconChartBar } from '@tabler/icons-react';

export default function HomePage() {
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
                <IconCards size={48} color="blue" />
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
                <IconUsers size={48} color="green" />
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
                <IconChartBar size={48} color="orange" />
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
            <Button size="lg" variant="filled">
              Start a Session
            </Button>
            <Button size="lg" variant="outline">
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
    </Container>
  );
}
