import {
  initialize,
  MidiTrack,
  type ActivationContext,
  type Handle,
  type NoteDescription,
} from "@ableton-extensions/sdk";

import modalInterface from "./interface.html";

interface MarkerData {
  time: number; // seconds from video start
}

interface DialogResult {
  markers: MarkerData[];
}

export function activate(activation: ActivationContext) {
  const context = initialize(activation, "1.0.0");

  context.ui.registerContextMenuAction(
    "MidiTrack",
    "Video Hit Marker",
    "videoHitMarker.open",
  );

  context.commands.registerCommand(
    "videoHitMarker.open",
    async (arg: unknown) => {
      const track = context.getObjectFromHandle(arg as Handle, MidiTrack);

      const result = await context.ui.showModalDialog(
        `data:text/html,${encodeURIComponent(modalInterface)}`,
        960,
        680,
      );

      if (!result) return;

      const data: DialogResult = JSON.parse(result);

      if (!data.markers || data.markers.length === 0) {
        console.log("No markers to generate.");
        return;
      }

      const tempo = context.application.song!.tempo;
      const beatsPerSecond = tempo / 60;

      // Sort markers by time
      const sorted = [...data.markers].sort((a, b) => a.time - b.time);
      const rawLastBeat = sorted[sorted.length - 1]!.time * beatsPerSecond;
      const clipDuration = rawLastBeat + 0.5; // add tail

      const clip = await track.createMidiClip(0, clipDuration);
      clip.name = "Hit Points";

      const notes: NoteDescription[] = sorted.map((marker) => ({
        pitch: 60,
        startTime: marker.time * beatsPerSecond,
        duration: 0.25,
        velocity: 100,
      }));

      clip.notes = notes;

      console.log(
        `Generated ${notes.length} MIDI notes on track "${track.name}"`,
      );
    },
  );
}
