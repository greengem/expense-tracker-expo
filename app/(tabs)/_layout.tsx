import { Link, Tabs } from 'expo-router'
import { Pressable } from 'react-native'
import { IconDashboard, IconCreditCardPay, IconInfoCircle, IconHistory, IconCategory } from '@tabler/icons-react-native';

export default function TabLayout() {
  return (
    // FIX: Should be using nativewind classes and not hardcoded for dark mode
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#181825',
        },
        headerTintColor: '#cdd6f4',
        tabBarActiveTintColor: '#89b4fa',
        tabBarStyle: {
          backgroundColor: '#181825',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconDashboard size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="new-transaction"
        options={{
          title: 'New Transaction',
          tabBarIcon: ({ color }) => <IconCreditCardPay color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <IconCategory color={color} />,
          headerRight: () => (
            <Link href="/new-category-modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <IconInfoCircle
                    size={25}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <IconHistory color={color} />,
        }}
      />
    </Tabs>
  )
}
