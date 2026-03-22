# Free Tier ElevenLabs Voices

These pre-made voices work with the **free tier** (10,000 characters/month):

## Available Voices

| Voice ID | Name | Gender | Description |
|----------|------|--------|-------------|
| `21m00Tcm4TlvDq8ikWAM` | **Rachel** | Female | Calm, clear American accent (CURRENT DEFAULT) |
| `ErXwobaYiN019PkySvjV` | **Antoni** | Male | Well-rounded, friendly |
| `VR6AewLTigWG4xSOukaG` | **Arnold** | Male | Crisp, authoritative |
| `pNInz6obpgDQGcFmaJgB` | **Adam** | Male | Deep, professional |
| `yoZ06aMxZJJ28mfd3POQ` | **Sam** | Male | Raspy, dynamic |
| `AZnzlk1XvdvUeBnXmlld` | **Domi** | Female | Strong, confident |
| `MF3mGyEYCl7XYWbV9V6O` | **Elli** | Female | Emotional, expressive |
| `TxGEqnHWrfWFTfGW9XjX` | **Josh** | Male | Young, casual |
| `EXAVITQu4vr4xnSDxMaL` | **Bella** | Female | Soft, soothing |
| `oWAxZDx7w5VEj9dCyTzz` | **Grace** | Female | Warm, Southern accent |
| `CYw3kZ02Hs0563khs1Fj` | **Dave** | Male | Conversational British |

## How to Change the Voice

### Option 1: Change Default Voice

Edit `~/.env`:
```bash
ELEVENLABS_VOICE_ID=ErXwobaYiN019PkySvjV  # Antoni (male)
```

Then restart the server:
```bash
cd /home/alvis/PAI/.claude/voice-server
./start-wsl.sh
```

### Option 2: Specify Per-Request

```bash
curl -X POST http://localhost:8888/notify \
  -H "Content-Type: application/json" \
  -d '{"message":"Testing Antoni voice", "voice_id":"ErXwobaYiN019PkySvjV"}'
```

## Testing Different Voices

Quick test script:
```bash
# Test Rachel (female)
curl -X POST http://localhost:8888/notify -H "Content-Type: application/json" \
  -d '{"message":"This is Rachel speaking", "voice_id":"21m00Tcm4TlvDq8ikWAM"}'

# Test Antoni (male)
curl -X POST http://localhost:8888/notify -H "Content-Type: application/json" \
  -d '{"message":"This is Antoni speaking", "voice_id":"ErXwobaYiN019PkySvjV"}'

# Test Adam (deep male)
curl -X POST http://localhost:8888/notify -H "Content-Type: application/json" \
  -d '{"message":"This is Adam speaking", "voice_id":"pNInz6obpgDQGcFmaJgB"}'
```

## Premium Voices (Require Paid Plan)

The voices in `voices.json` are **library/premium voices** and require upgrading:
- Jamie (Premium) - UK Male
- Ava (Premium) - US Female
- Serena (Premium) - UK Female
- Isha (Premium) - Indian Female
- Etc.

To use these, upgrade at: https://elevenlabs.io/pricing

## Current Configuration

Your system is configured to use:
- **Model**: `eleven_multilingual_v2` (supports 29 languages)
- **Default Voice**: Rachel (`21m00Tcm4TlvDq8ikWAM`)
- **Audio Player**: mpv (WSL/Linux compatible)
