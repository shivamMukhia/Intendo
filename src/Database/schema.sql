-- users table (mapped to Firebase UID)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firebase_uid TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL
);

-- video likes and dislikes
CREATE TABLE video_reactions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  video_id TEXT NOT NULL,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'dislike')),
  UNIQUE (user_id, video_id)
);

-- channels table (each creator has a channel)
CREATE TABLE channels (
    id SERIAL PRIMARY KEY,
    firebase_uid TEXT UNIQUE NOT NULL,   -- the creator’s Firebase UID
    name TEXT NOT NULL,
    image_url TEXT,                       -- store channel profile image link
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- subscriptions (user <-> channel)
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, channel_id)           -- one subscription per user per channel
);

-- On DELETE CASCADE mean when i delete channel from db then subscriptions also get delete


CREATE TABLE watch_tracker (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  video_id TEXT NOT NULL,
  category TEXT CHECK (category IN ('education', 'entertainment')),
  watch_time_seconds INT DEFAULT 0,
  watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_video UNIQUE (user_id, video_id) -- 🔹 ensures uniqueness
);

--contraint unique(user_id , video_id ) that mean user_id and video_id should always be unique 
-- and even if same user play the same video again then it would update watch_time_seconds instead of inserting into different rows

-- we can even achieve this without contraint because in our case user id and video id is always unique but it is clean way


CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY,
  hide_feed BOOLEAN DEFAULT false,
  edu_only BOOLEAN DEFAULT false,
  subs_only BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    video_id TEXT UNIQUE NOT NULL,   -- YouTube ID or internal ID
    video_thumbnail TEXT NOT NULL
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id INT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
