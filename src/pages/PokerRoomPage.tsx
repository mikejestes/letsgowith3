import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Container,
  Title,
  Paper,
  Group,
  Button,
  TextInput,
  Text,
  Badge,
  Stack,
  Grid,
  Card,
  Divider,
  Alert,
  Modal,
  Textarea
} from '@mantine/core';
import { Users, Wifi, WifiOff, Crown, Eye, EyeOff } from 'lucide-react';
import { usePokerRoom } from '../hooks/usePokerRoom';
import { VOTING_VALUES } from '../types/poker';

export default function PokerRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const userName = searchParams.get('name') || `User_${Math.random().toString(36).substr(2, 8)}`;
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryDescription, setNewStoryDescription] = useState('');

  const {
    isConnected,
    onlineUsers,
    stories,
    currentRound,
    currentStory,
    currentRoundVotes,
    currentUserVote,
    isLeader,
    createStory,
    startRound,
    castVote,
    revealVotes,
    endRound
  } = usePokerRoom(roomId || 'default', userId, userName);

  const handleCreateStory = () => {
    if (newStoryTitle.trim()) {
      createStory(newStoryTitle.trim(), newStoryDescription.trim() || undefined);
      setNewStoryTitle('');
      setNewStoryDescription('');
      setStoryModalOpen(false);
    }
  };

  const handleStartRound = (storyId: string) => {
    startRound(storyId);
  };

  const handleVote = (value: string) => {
    castVote(value);
  };

  const canRevealVotes = isLeader && currentRound && !currentRound.votesRevealed && currentRoundVotes.length > 0;
  const canEndRound = isLeader && currentRound && currentRound.votesRevealed;

  const voteResults = currentRound?.votesRevealed 
    ? currentRoundVotes.reduce((acc, vote) => {
        if (vote.value) {
          acc[vote.value] = (acc[vote.value] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    : {};

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {/* Header */}
        <Paper p="md" withBorder>
          <Group justify="space-between" align="center">
            <Group>
              <Title order={2}>Poker Room: {roomId}</Title>
              <Badge 
                color={isConnected ? 'green' : 'red'} 
                variant="light"
                leftSection={isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
              >
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </Group>
            <Group>
              <Users size={20} />
              <Text size="sm">{onlineUsers.length} online</Text>
            </Group>
          </Group>
        </Paper>

        <Grid>
          {/* Left Column - Users & Stories */}
          <Grid.Col span={4}>
            {/* Online Users */}
            <Card withBorder mb="md">
              <Card.Section p="md">
                <Title order={4}>Online Users</Title>
              </Card.Section>
              <Stack gap="xs">
                {onlineUsers.map(user => (
                  <Group key={user.id} justify="space-between">
                    <Text size="sm">{user.name}</Text>
                    {user.isLeader && <Crown size={16} color="gold" />}
                  </Group>
                ))}
              </Stack>
            </Card>

            {/* Stories */}
            <Card withBorder>
              <Card.Section p="md">
                <Group justify="space-between">
                  <Title order={4}>Stories</Title>
                  {isLeader && (
                    <Button size="xs" onClick={() => setStoryModalOpen(true)}>
                      Add Story
                    </Button>
                  )}
                </Group>
              </Card.Section>
              <Stack gap="xs">
                {stories.map(story => (
                  <Paper key={story.id} p="xs" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" fw={500}>{story.title}</Text>
                        {story.description && (
                          <Text size="xs" c="dimmed">{story.description}</Text>
                        )}
                      </div>
                      {isLeader && !currentRound?.isActive && (
                        <Button 
                          size="xs" 
                          variant="light"
                          onClick={() => handleStartRound(story.id)}
                        >
                          Start
                        </Button>
                      )}
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Grid.Col>

          {/* Right Column - Voting Area */}
          <Grid.Col span={8}>
            {currentRound && currentStory ? (
              <Card withBorder>
                <Card.Section p="md">
                  <Group justify="space-between">
                    <div>
                      <Title order={3}>{currentStory.title}</Title>
                      {currentStory.description && (
                        <Text c="dimmed">{currentStory.description}</Text>
                      )}
                    </div>
                    <Badge color={currentRound.votesRevealed ? 'blue' : 'gray'}>
                      {currentRound.votesRevealed ? 'Votes Revealed' : 'Voting in Progress'}
                    </Badge>
                  </Group>
                </Card.Section>

                <Divider />

                {/* Voting Buttons */}
                {!currentRound.votesRevealed && (
                  <Card.Section p="md">
                    <Title order={5} mb="md">Cast Your Vote</Title>
                    <Group gap="xs">
                      {VOTING_VALUES.map(value => (
                        <Button
                          key={value}
                          variant={currentUserVote?.value === value ? 'filled' : 'outline'}
                          size="lg"
                          onClick={() => handleVote(value)}
                          style={{ minWidth: '50px' }}
                        >
                          {value}
                        </Button>
                      ))}
                    </Group>
                    {currentUserVote && (
                      <Alert mt="md" color="green">
                        You voted: {currentUserVote.value}
                      </Alert>
                    )}
                  </Card.Section>
                )}

                <Divider />

                {/* Voting Status */}
                <Card.Section p="md">
                  <Group justify="space-between" mb="md">
                    <Title order={5}>Voting Status</Title>
                    <Text size="sm" c="dimmed">
                      {currentRoundVotes.length} / {onlineUsers.length} votes
                    </Text>
                  </Group>

                  <Group gap="xs" mb="md">
                    {onlineUsers.map(user => {
                      const userVote = currentRoundVotes.find(v => v.userId === user.id);
                      const hasVoted = userVote && userVote.value !== null;
                      
                      return (
                        <Badge
                          key={user.id}
                          color={hasVoted ? 'green' : 'gray'}
                          variant="light"
                        >
                          {user.name}: {currentRound.votesRevealed && userVote?.value 
                            ? userVote.value 
                            : hasVoted ? '✓' : '⏳'
                          }
                        </Badge>
                      );
                    })}
                  </Group>

                  {/* Leader Controls */}
                  {isLeader && (
                    <Group gap="md">
                      {canRevealVotes && (
                        <Button 
                          leftSection={<Eye size={16} />}
                          onClick={revealVotes}
                        >
                          Reveal Votes
                        </Button>
                      )}
                      {canEndRound && (
                        <Button 
                          color="red"
                          leftSection={<EyeOff size={16} />}
                          onClick={endRound}
                        >
                          End Round
                        </Button>
                      )}
                    </Group>
                  )}

                  {/* Vote Results */}
                  {currentRound.votesRevealed && Object.keys(voteResults).length > 0 && (
                    <div>
                      <Title order={6} mt="md" mb="xs">Results:</Title>
                      <Group gap="xs">
                        {Object.entries(voteResults).map(([value, count]) => (
                          <Badge key={value} size="lg" variant="filled">
                            {value}: {count}
                          </Badge>
                        ))}
                      </Group>
                    </div>
                  )}
                </Card.Section>
              </Card>
            ) : (
              <Card withBorder>
                <Card.Section p="md">
                  <Text ta="center" c="dimmed">
                    {isLeader 
                      ? "Select a story to start voting" 
                      : "Waiting for the leader to start a voting round"
                    }
                  </Text>
                </Card.Section>
              </Card>
            )}
          </Grid.Col>
        </Grid>
      </Stack>

      {/* Add Story Modal */}
      <Modal
        opened={storyModalOpen}
        onClose={() => setStoryModalOpen(false)}
        title="Add New Story"
      >
        <Stack gap="md">
          <TextInput
            label="Story Title"
            placeholder="As a user, I want to..."
            value={newStoryTitle}
            onChange={(e) => setNewStoryTitle(e.target.value)}
            required
          />
          <Textarea
            label="Description (optional)"
            placeholder="Additional details about this story..."
            value={newStoryDescription}
            onChange={(e) => setNewStoryDescription(e.target.value)}
            rows={3}
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setStoryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateStory} disabled={!newStoryTitle.trim()}>
              Add Story
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
