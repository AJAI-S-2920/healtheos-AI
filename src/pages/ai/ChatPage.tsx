import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/common/GlassCard';
import geminiService, { ChatMessage } from '../../services/geminiService';
import reportsService from '../../services/reportsService';
import { MedicalReport } from '../../types/report';

export const ChatPage: React.FC = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [activeReport, setActiveReport] = useState<MedicalReport | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'ai',
      text: 'Hello! I am HealthOS AI, your personal clinical health assistant powered by Google Gemini. Ask me any question regarding your lab test results, blood work parameters, or disease prevention strategies.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const promptSuggestions = [
    'Explain my HbA1c and Glucose levels',
    'How can I lower my LDL cholesterol naturally?',
    'What questions should I ask my doctor about Vitamin D?',
    'What is the difference between HDL and LDL?',
  ];

  useEffect(() => {
    async function load() {
      const data = await reportsService.getReports(currentUser?.uid);
      setReports(data);
      if (data.length > 0) {
        setSelectedReportId(data[0].id);
        setActiveReport(data[0]);
      }
    }
    load();
  }, [currentUser]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleReportSelect = (id: string) => {
    setSelectedReportId(id);
    const rep = reports.find((r) => r.id === id) || null;
    setActiveReport(rep);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setSending(true);

    try {
      const aiReplyText = await geminiService.sendMessage(text, messages, activeReport);
      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ pb: 4, height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366F1 0%, #0D9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesomeIcon sx={{ color: '#FFF', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              AI Health Chat Assistant
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Powered by Google Gemini 1.5 Flash API
            </Typography>
          </Box>
        </Box>

        {/* Report Context Selector */}
        <Box sx={{ minWidth: 260 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="context-select-label">Active Report Context</InputLabel>
            <Select
              labelId="context-select-label"
              value={selectedReportId}
              label="Active Report Context"
              onChange={(e) => handleReportSelect(e.target.value)}
            >
              <MenuItem value="">
                <em>No specific report (General Health)</em>
              </MenuItem>
              {reports.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionOutlinedIcon fontSize="small" color="primary" />
                    {r.fileName}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Messages Scroll Box */}
      <GlassCard
        sx={{
          flexGrow: 1,
          p: 3,
          mb: 2.5,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          borderRadius: 4,
        }}
      >
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: isAI ? 'row' : 'row-reverse',
                alignItems: 'flex-start',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: isAI ? 'secondary.main' : 'primary.main',
                  width: 38,
                  height: 38,
                }}
              >
                {isAI ? <SmartToyOutlinedIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
              </Avatar>

              <Box sx={{ maxWidth: '80%' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: isAI
                      ? isDark
                        ? 'rgba(17, 28, 56, 0.9)'
                        : '#F1F5F9'
                      : 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
                    color: isAI ? 'text.primary' : '#FFFFFF',
                    border: isAI
                      ? isDark
                        ? '1px solid rgba(255,255,255,0.08)'
                        : '1px solid rgba(0,0,0,0.06)'
                      : 'none',
                    boxShadow: isAI ? 'none' : '0 4px 14px rgba(13, 148, 136, 0.3)',
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </Typography>
                </Paper>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5, px: 1, textAlign: isAI ? 'left' : 'right', fontSize: '0.7rem' }}
                >
                  {msg.timestamp}
                </Typography>
              </Box>
            </Box>
          );
        })}

        {sending && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 38, height: 38 }}>
              <SmartToyOutlinedIcon fontSize="small" />
            </Avatar>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(17, 28, 56, 0.9)' : '#F1F5F9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CircularProgress size={18} color="secondary" />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Gemini AI is analyzing clinical data...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <div ref={chatBottomRef} />
      </GlassCard>

      {/* Suggestion Chips */}
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1.5, flexShrink: 0 }}>
        {promptSuggestions.map((sug, idx) => (
          <Chip
            key={idx}
            label={sug}
            onClick={() => handleSend(sug)}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
          />
        ))}
      </Box>

      {/* Input Box */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}
      >
        <TextField
          fullWidth
          placeholder="Ask HealthOS AI a question about your medical reports or symptoms..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={sending}
          variant="outlined"
          sx={{ bgcolor: isDark ? '#111C38' : '#FFFFFF', borderRadius: 3 }}
        />

        <IconButton
          type="submit"
          color="primary"
          disabled={!inputMessage.trim() || sending}
          sx={{
            width: 54,
            height: 54,
            bgcolor: 'primary.main',
            color: '#FFF',
            borderRadius: 3,
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatPage;
