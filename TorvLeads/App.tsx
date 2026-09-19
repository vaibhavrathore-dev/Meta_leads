import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Lead = {
  id: string;
  created_time: string;
  email?: string;
  full_name?: string;
};

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
  const socket = new WebSocket('ws://127.0.0.1:8000/ws');

  socket.onerror = error => {
  console.log('WebSocket error:', error);
};

  socket.onopen = () => {
     console.log('WebSocket connected');  
    setConnected(true);
  };

  socket.onmessage = event => {
    const lead = JSON.parse(event.data);
    setLeads(previous => [lead, ...previous]);
  };

  socket.onclose = event => {
    console.log('WebSocket closed:', event.code, event.reason);
    setConnected(false);
  };

  return () => {
    socket.close();
  };
}, []);
  return (
   <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" />

    <View>
      <Text style={styles.title}>TORV</Text>
      <Text style={styles.subtitle}>Live Leads</Text>

     <Text style={connected ? styles.connected : styles.disconnected}>
       {connected ? '● Connected' : '● Disconnected'}
     </Text>
    </View>
  {leads.map(lead => (
     <View key={lead.id} style={styles.leadCard}>
      <Text style={styles.leadName}>
      {lead.full_name || 'Unknown Lead'}
      </Text>

      <Text style={styles.leadDetail}>
      {lead.email || 'No email'}
     </Text>

     <Text style={styles.leadTime}>
      {lead.created_time}
     </Text>
   </View>
))}

  </SafeAreaView>
);
}

const styles = StyleSheet.create({

  container: {
  flex: 1,
  padding: 24,
  backgroundColor: '#111111',
},

title: {
  fontSize: 32,
  fontWeight: '700',
  color: '#FFFFFF',
},

subtitle: {
  fontSize: 18,
  color: '#AAAAAA',
},
  leadCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
  },
  leadName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  leadDetail: {
    color: '#B0B0B0',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leadTime: {
    color: '#666666',
    fontSize: 12,
    marginTop: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  connected: {
    color: '#4CAF50',
  },
  disconnected: {
    color: '#F44336', 
  },
});

export default App;