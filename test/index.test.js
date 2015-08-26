/* global describe, it */
'use strict'

require('must')

const demand = require('must')
const sinon = require('sinon')

const Graph = require('../libs/')

describe('Graph', function () {

  describe('#constructor', function () {

    it('creates an instance of Graph', function () {
      let graph = new Graph()

      graph.must.be.instanceOf(Graph)
    })

    it('populates the vertices with the passed point', function () {
      var graph = new Graph({
        a: { b: 1, c: 2 }
      })

      graph.vertices.must.be.instanceOf(Map)
      graph.vertices.size.must.equal(1)
      graph.vertices.get('a').must.be.object()
    })

  })

  describe('#addVertex()', function () {
    it('adds a vertex', function () {
      let graph = new Graph()

      graph.addVertex('a', { b: 10, c: 20 })

      let vertex = graph.vertices.get('a')

      vertex.must.be.object()
      vertex.must.have.keys([ 'b', 'c' ])
    })

    it('returns the Graph object', function () {
      let graph = new Graph()

      graph.addVertex('a', { b: 10, c: 20 }).must.be.instanceOf(Graph)
    })

    it('requires name to be a string', function () {
      let graph = new Graph()

      demand(graph.addVertex.bind(graph, 2, { b: 10, c: 20 })).throw(TypeError)
    })

    it('requires edges to be an object', function () {
      let graph = new Graph()

      demand(graph.addVertex.bind(graph, 'ok', 10)).throw(TypeError)
    })
  })

  describe('#path()', function () {
    const vertices = {
      a: { b: 20, c: 80 },
      b: { a: 20, c: 20 },
      c: { a: 80, b: 20 }
    }

    it('retuns the shortest path', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'c')

      path.must.eql([ 'a', 'b', 'c' ])
    })

    it('retuns the inverted path', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'c', { reverse: true })

      path.must.eql([ 'c', 'b', 'a' ])
    })

    it('retuns the trimmed path', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'c', { trim: true })

      path.must.eql([ 'b' ])
    })

    it('retuns the reverse and trimmed path', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'c', { trim: true })

      path.must.eql([ 'b' ])
    })

    it('returns null when no path is found', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'd')

      demand(path).be.null()
    })

    it('returns null when no vertices are defined', function () {
      const route = new Graph()

      const path = route.path('a', 'd')

      demand(path).be.null()
    })

    it('works with a more complicated graph', function () {
      const route = new Graph({
        a: { b: 7, c: 9, f: 14 },
        b: { c: 10, d: 15 },
        c: { d: 11, f: 2 },
        d: { e: 6 },
        e: { f: 9 }
      })

      const path = route.path('a', 'e')

      path.must.eql([ 'a', 'c', 'd', 'e' ])
    })

  })

  describe('#shortestPath()', function () {
    it('is an alias of path', function () {
      var route = new Graph({
        a: { b: 20, c: 80 },
        b: { a: 20, c: 20 },
        c: { a: 80, b: 20 }
      })

      sinon.spy(route, 'path')

      route.shortestPath('a', 'c')
      sinon.assert.calledOnce(route.path)
    })
  })

})