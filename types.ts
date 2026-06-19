/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface EventItem {
  id: string;
  name: string;
  category: string;
  image: string;
  date: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Project {
  id: string;
  title: string;
  tags: string[];
  image: string;
  description: string;
}

export enum Section {
  HERO = 'hero',
  EVENTS = 'events',
  COMMUNITY = 'community',
  PROJECTS = 'projects',
}
