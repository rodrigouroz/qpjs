/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
/* eslint-enable import/no-extraneous-dependencies */
import qp from '../src'

describe('qpjs', () => {
  it('declares winner the team with most aggregate goals', () => {
    const data = {
      teams: ['foo', 'bar'],
      games: [{ home: 2, away: 1 }, { home: 1, away: 1 }]
    }
    const expected = { winner: 'foo', reason: 'AGGREGATE' }
    expect(qp(data)).to.deep.equal(expected)
  })

  it('considers away goals in case of a tie in aggregate score', () => {
    const data = {
      teams: ['foo', 'bar'],
      games: [{ home: 2, away: 1 }, { home: 3, away: 2 }]
    }
    const expected = { winner: 'foo', reason: 'AWAY_GOALS' }
    expect(qp(data)).to.deep.equal(expected)
  })

  it('declares a tie if both aggregate and away goals are equal', () => {
    const data = {
      teams: ['foo', 'bar'],
      games: [{ home: 2, away: 1 }, { home: 2, away: 1 }]
    }
    const expected = { winner: undefined, reason: 'FULL_TIE' }
    expect(qp(data)).to.deep.equal(expected)
  })

  it('accepts option to return scalar result', () => {
    const data = {
      teams: ['foo', 'bar'],
      games: [{ home: 2, away: 3 }, { home: 4, away: 2 }]
    }
    const options = { fullResult: false }
    expect(qp(data, options)).to.equal('bar')
  })

  it('defaults team names if not given', () => {
    const data1 = {
      games: [{ home: 3, away: 1 }, { home: 2, away: 1 }]
    }
    const data2 = {
      games: [{ home: 3, away: 3 }, { home: 2, away: 1 }]
    }
    const options = { fullResult: false }
    expect(qp(data1, options)).to.equal('Team 1')
    expect(qp(data2, options)).to.equal('Team 2')
  })

  it('accepts an option to ignore away goals rule', () => {
    const data = {
      teams: ['foo', 'bar'],
      games: [{ home: 2, away: 1 }, { home: 3, away: 2 }]
    }
    const options = { awayGoalsRule: false }
    const expected = { winner: undefined, reason: 'TIE' }
    expect(qp(data, options)).to.deep.equal(expected)
  })

  it('rejects input when no games provided', () => {
    const data = { teams: ['foo', 'bar'] }
    expect(() => qp(data)).to.throw('Missing games info')
  })

  it('rejects input when only one game provided', () => {
    const data = {
      teams: ['foo', 'bar'],
      games: [{ home: 2, away: 1 }]
    }
    expect(() => qp(data)).to.throw('Need to provide info for exactly two games')
  })

  it('rejects input when too many games provided', () => {
    const data = {
      teams: ['foo', 'bar'],
      games: [{ home: 2, away: 1 }, { home: 2, away: 1 }, { home: 2, away: 1 }]
    }
    expect(() => qp(data)).to.throw('Need to provide info for exactly two games')
  })

  it('rejects input when invalid games data provided', () => {
    const data1 = {
      teams: ['foo', 'bar'],
      games: [{ home: 2 }, { home: 2, away: 1 }]
    }
    const data2 = {
      teams: ['foo', 'bar'],
      games: [{ home: 2, away: 1 }, { foo: 2, away: 1 }]
    }
    const data3 = {
      teams: ['foo', 'bar'],
      games: [{ home: 2, away: 1 }, { home: 'Bad', away: 1 }]
    }
    expect(() => qp(data1)).to.throw('Invalid games data')
    expect(() => qp(data2)).to.throw('Invalid games data')
    expect(() => qp(data3)).to.throw('Invalid games data')
  })

  it('rejects input when only one team provided', () => {
    const data = {
      teams: ['foo'],
      games: [{ home: 2, away: 1 }, { home: 2, away: 2 }]
    }
    expect(() => qp(data)).to.throw('Need to provide info for exactly two teams')
  })

  it('rejects input when too many teams provided', () => {
    const data = {
      teams: ['foo', 'bar', 'baz'],
      games: [{ home: 2, away: 1 }, { home: 2, away: 1 }]
    }
    expect(() => qp(data)).to.throw('Need to provide info for exactly two teams')
  })

  it('rejects input when invalid teams data is provided', () => {
    const data = {
      teams: ['foo', 3],
      games: [{ home: 2, away: 1 }, { home: 2, away: 1 }]
    }
    expect(() => qp(data)).to.throw('Invalid team data')
  })

  it('accepts 0 as a valid score', () => {
    const data = {
      teams: ['foo', 'bar'],
      games: [{ home: 0, away: 3 }, { home: 0, away: 2 }]
    }
    const options = { fullResult: false }
    expect(qp(data, options)).to.equal('bar')
  })
})
