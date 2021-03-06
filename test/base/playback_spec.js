import Playback from 'base/playback'
import Core from '../../src/components/core'
import PlayerError from '../../src/components/error'

describe('Playback', function() {
  beforeEach(() => {
    this.basePlayback = new Playback({})
  })

  it('has default duration', () => {
    expect(this.basePlayback.getDuration()).to.be.equal(0)
  })

  it('is not playing', () => {
    expect(this.basePlayback.isPlaying()).to.be.equal(false)
  })

  it('is not ready', () => {
    expect(this.basePlayback.isReady).to.be.equal(false)
  })

  it('has NO_OP as playback type', () => {
    expect(this.basePlayback.getPlaybackType()).to.be.equal(Playback.NO_OP)
  })

  it('is not on highdefintion', () => {
    expect(this.basePlayback.isHighDefinitionInUse()).to.be.equal(false)
  })

  it('destroys by removing element from DOM', () => {
    const spy = sinon.spy()
    this.basePlayback.$el = { remove: spy }

    this.basePlayback.destroy()

    expect(spy).to.have.been.calledOnce
  })

  describe('error', () => {
    beforeEach(() => {
      this.core = new Core({})
      this.basePlayback = new Playback({}, null, this.core.playerError)
      this.playerError = this.basePlayback.playerError
    })

    it('creates a default error if no error data is given', () => {
      const errorData = this.basePlayback.createError()
      const defaultError = {
        description: '',
        level: PlayerError.Levels.FATAL,
        origin: 'playback',
        scope: 'playback',
        raw: {},
        code: 'playback:unknown',
      }

      expect(errorData).to.deep.equal(defaultError)
    })

    it('creates a error code on the following format: name:code', () => {
      this.basePlayback.name = 'test'
      const error = { code: '42' }
      const errorData = this.basePlayback.createError(error)

      expect(errorData.code).to.deep.equal(`${this.basePlayback.name}:${error.code}`)
    })

    it('has default error level equals to FATAL', () => {
      const errorData = this.basePlayback.createError()

      expect(errorData.level).to.deep.equal(PlayerError.Levels.FATAL)
    })

    it('does not use default level when its set on error', () => {
      const error = { level: PlayerError.Levels.WARN }
      const errorData = this.basePlayback.createError(error)

      expect(errorData.level).to.deep.equal(PlayerError.Levels.WARN)
    })

    it('always calls error to trigger ERROR event', () => {
      const defaultError = {
        description: '',
        level: PlayerError.Levels.FATAL,
        origin: 'playback',
        scope: 'playback',
        raw: {},
        code: 'playback:unknown',
      }
      const spy = sinon.spy(this.playerError, 'error')
      this.basePlayback.createError()

      expect(spy).to.have.been.calledWith(defaultError)
    })
  })
})
