import { useState, useEffect, useCallback } from 'react';
import * as LucideIcons from 'lucide-react';

const ACTIVITY_STORAGE_KEY = 'enfermagem-pro-activity';
const MAX_ACTIVITIES = 10;

export interface Activity {
  type: string;
  title: string;
  path: string;
  timestamp: number;
  icon: keyof typeof LucideIcons;
}

const getStoredActivities = (): Activity[] => {
  try {
    const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to parse activities from localStorage", error);
    return [];
  }
};

const setStoredActivities = (activities: Activity[]) => {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error("Failed to save activities to localStorage", error);
  }
};

export const useActivityTracker = () => {
  const [activities, setActivities] = useState<Activity[]>(getStoredActivities);

  useEffect(() => {
    setActivities(getStoredActivities());
  }, []);

  const addActivity = useCallback((activity: Omit<Activity, 'timestamp'>) => {
    const newActivity: Activity = { ...activity, timestamp: Date.now() };
    
    const currentActivities = getStoredActivities();
    
    const filteredActivities = currentActivities.filter(act => act.path !== newActivity.path);
    
    const updatedActivities = [newActivity, ...filteredActivities].slice(0, MAX_ACTIVITIES);
    
    setStoredActivities(updatedActivities);
    setActivities(updatedActivities);
  }, []);

  return { activities, addActivity };
};