import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Container,
  Title,
  Paper,
  Group,
  Button,
  Text,
  Badge,
  Stack,
  Grid,
  Card,
  Divider,
  Alert,
  TextInput,
  Modal,
  ActionIcon
} from '@mantine/core';
import { Users, Wifi, WifiOff, Crown, Eye, EyeOff, Play, Edit } from 'lucide-react';
import { usePokerRoom } from '../hooks/usePokerRoom';
import { VOTING_VALUES } from '../types/poker';
import { nameUtils } from '../utils/nameUtils';

export default function PokerRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [nameEditModalOpen, setNameEditModalOpen] = useState(false);
  const [namePromptModalOpen, setNamePromptModalOpen] = useState(false);
  const [tempUserName, setTempUserName] = useState('');
  
  // Initialize userName from URL params, localStorage, or prompt user
  const [userName, setUserName] = useState(() => {
    const urlName = searchParams.get('name');
    if (urlName) return urlName;
    
    const storedName = nameUtils.getStoredName();
    if (storedName) return storedName;
    
    // No name available - we'll show a prompt
    return '';
  });

  // Show name prompt if no userName is set
  useEffect(() => {
    if (!userName) {
      setNamePromptModalOpen(true);
      setTempUserName('');
    }
  }, [userName]);
  
  // Generate consistent userId based on session or use a persistent one
  const userId = useState(() => {
    const stored = sessionStorage.getItem(`letsgo3_userId_${roomId}`);
    if (stored) return stored;
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(`letsgo3_userId_${roomId}`, newId);
    return newId;
  })[0];

  const {
    isConnected,
    onlineUsers,
    currentRound,
    currentRoundVotes,
    currentUserVote,
    isLeader,
    startRound,
    castVote,
    revealVotes,
    endRound
  } = usePokerRoom(roomId || 'default', userId, userName || 'Loading...');

  const handleStartRound = () => {
    startRound();
  };

  const handleVote = (value: string) => {
    castVote(value);
  };

  const handleOpenNameEdit = () => {
    setTempUserName(userName);
    setNameEditModalOpen(true);
  };

  const handleSaveName = () => {
    if (tempUserName.trim()) {
      nameUtils.saveName(tempUserName.trim());
      // Update URL with new name
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('name', tempUserName.trim());
      setSearchParams(newSearchParams);
      setUserName(tempUserName.trim());
      setNameEditModalOpen(false);
    }
  };

  const handleSaveNameFromPrompt = () => {
    if (tempUserName.trim()) {
      const newName = tempUserName.trim();
      nameUtils.saveName(newName);
      // Update URL with new name
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('name', newName);
      setSearchParams(newSearchParams);
      setUserName(newName);
      setNamePromptModalOpen(false);
    }
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
      {userName ? (
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
                <Group gap="xs">
                  <Text size="sm">You are: <strong>{userName}</strong></Text>
                  <ActionIcon 
                    variant="subtle" 
                    size="sm" 
                    onClick={handleOpenNameEdit}
                    title="Edit your name"
                  >
                    <Edit size={14} />
                  </ActionIcon>
                </Group>
                <Group gap="xs">
                  <Users size={20} />
                  <Text size="sm">{onlineUsers.length} online</Text>
                </Group>
              </Group>
            </Group>
          </Paper>

          <Grid>
            {/* Left Column - Users */}
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
            </Grid.Col>

            {/* Right Column - Voting Area */}
            <Grid.Col span={8}>
              {currentRound ? (
                <Card withBorder>
                  <Card.Section p="md">
                    <Group justify="space-between">
                      <Title order={3}>Voting Round</Title>
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
                        ? (
                          <Button leftSection={<Play size={16} />} onClick={handleStartRound}>
                            Start New Voting Round
                          </Button>
                        )
                        : "Waiting for the leader to start a voting round"
                      }
                    </Text>
                  </Card.Section>
                </Card>
              )}
            </Grid.Col>
          </Grid>
        </Stack>
      ) : (
        <Stack align="center" gap="md" py="xl">
          <Title order={2}>Welcome to Poker Room: {roomId}</Title>
          <Text c="dimmed">Please enter your name to join the room</Text>
        </Stack>
      )}

      {/* Edit Name Modal */}
      <Modal
        opened={nameEditModalOpen}
        onClose={() => setNameEditModalOpen(false)}
        title="Edit Your Name"
      >
        <Stack gap="md">
          <TextInput
            label="Your Name"
            placeholder="Enter your name"
            value={tempUserName}
            onChange={(e) => setTempUserName(e.target.value)}
            required
            onKeyDown={(e) => {
              if (e.key === 'Enter' && tempUserName.trim()) {
                handleSaveName();
              }
            }}
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setNameEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveName} disabled={!tempUserName.trim()}>
              Save Name
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Name Prompt Modal */}
      <Modal
        opened={namePromptModalOpen}
        onClose={() => {}}
        title="Welcome to the Poker Room!"
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Please enter your name to join the poker room
          </Text>
          <TextInput
            label="Your Name"
            placeholder="Enter your name"
            value={tempUserName}
            onChange={(e) => setTempUserName(e.target.value)}
            required
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && tempUserName.trim()) {
                handleSaveNameFromPrompt();
              }
            }}
          />
          <Group justify="flex-end">
            <Button onClick={handleSaveNameFromPrompt} disabled={!tempUserName.trim()}>
              Join Room
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
