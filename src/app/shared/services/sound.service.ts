import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private music: HTMLAudioElement | null = null;
  private isMuted = false;
  
  // Volume presets
  private readonly VOLUME_SFX = 0.6;
  private readonly VOLUME_MUSIC = 0.3;

  constructor() {
    this.initSounds();
  }

  private initSounds() {
    // UI Sounds
    this.preload('click', 'assets/sounds/click.mp3');
    this.preload('pop', 'assets/sounds/pop.mp3');
    this.preload('cancel', 'assets/sounds/cancel.mp3');
    this.preload('success', 'assets/sounds/success.mp3');

    // Game Sounds
    this.preload('flip', 'assets/sounds/whoosh.mp3');
    this.preload('match_found', 'assets/sounds/success.mp3');
  }

  preload(key: string, path: string) {
    const audio = new Audio(path);
    audio.load();
    this.sounds.set(key, audio);
  }

  playSfx(key: string, volumeScale: number = 1.0) {
    if (this.isMuted) {
      console.log(`[SoundService] Skipped ${key} (Muted)`);
      return;
    }

    const sound = this.sounds.get(key);
    if (sound) {
      // Log attempt
      console.log(`[SoundService] Playing ${key} (Vol: ${this.VOLUME_SFX * volumeScale})`);
      
      if (!sound.paused) {
        // Clone for overlapping sounds
        const clone = sound.cloneNode() as HTMLAudioElement;
        clone.volume = Math.min(this.VOLUME_SFX * volumeScale, 1);
        
        const playPromise = clone.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log(`[SoundService] Playback started: ${key} (clone)`))
            .catch(error => {
              console.error(`[SoundService] Playback FAILED for ${key} (clone):`, error);
              // Handle Autoplay Policy
              if (error.name === 'NotAllowedError') {
                 console.warn('[SoundService] Autoplay prevented. Waiting for user interaction.');
              }
            });
        }
      } else {
        sound.volume = Math.min(this.VOLUME_SFX * volumeScale, 1);
        sound.currentTime = 0;
        
        const playPromise = sound.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log(`[SoundService] Playback started: ${key}`))
            .catch(error => {
              console.error(`[SoundService] Playback FAILED for ${key}:`, error);
               if (error.name === 'NotAllowedError') {
                 console.warn('[SoundService] Autoplay prevented. Waiting for user interaction.');
              }
            });
        }
      }
    } else {
      console.warn(`[SoundService] Sound not found: ${key}`);
    }
  }


  click() {
    this.playSfx('click');
  }

  playMusic(path: string) {
    if (this.isMuted) return;

    if (this.music && !this.music.paused) {
        // If same music, do nothing
        if (this.music.src.includes(path)) return;
        this.fadeOutMusic();
    }

    const newMusic = new Audio(path);
    newMusic.loop = true;
    newMusic.volume = 0; // Start at 0 for fade in
    newMusic.play().then(() => {
        this.music = newMusic;
        this.fadeInMusic();
    }).catch(e => console.warn('Music failed', e));
  }

  stopMusic() {
    this.fadeOutMusic();
  }

  private fadeInMusic() {
    if (!this.music) return;
    let vol = 0;
    const interval = setInterval(() => {
        if (!this.music || vol >= this.VOLUME_MUSIC) {
            clearInterval(interval);
            return;
        }
        vol += 0.05;
        this.music.volume = Math.min(vol, this.VOLUME_MUSIC);
    }, 100);
  }

  private fadeOutMusic() {
    const current = this.music;
    if (!current) return;
    
    this.music = null; // Detach immediately so new music can start
    
    let vol = current.volume;
    const interval = setInterval(() => {
        if (vol <= 0.05) {
            current.pause();
            current.currentTime = 0;
            clearInterval(interval);
            return;
        }
        vol -= 0.05;
        current.volume = Math.max(0, vol);
    }, 100);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
        if (this.music) this.music.pause();
    } else {
        if (this.music) this.music.play();
    }
    return this.isMuted;
  }
}
