import React, { useState } from 'react';
import { Code, Zap, CheckCircle, AlertCircle, ArrowRight, BarChart3 } from 'lucide-react';

const MCAPDemo = () => {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [showComparison, setShowComparison] = useState(true);

  const scenarios = [
    {
      title: "Adding Error Handling",
      description: "Add database error handling to a user service function",
      singleChannel: `In the user_service.py file, look at the get_user_by_id function. Add proper error handling for when the database is unavailable, but make sure you don't change the function signature since it's used by the API layer. We typically use custom exception types in this project. Only modify this one function, don't touch the create_user function.`,
      singleTokens: 65,
      multiChannel: {
        DATA: {
          files: ["user_service.py"],
          functions: ["get_user_by_id"]
        },
        ACTION: {
          primary: "add_error_handling",
          error_types: ["database_unavailable"]
        },
        CONSTRAINT: {
          critical: ["preserve_function_signature"],
          reason: "api_layer_dependency"
        },
        CONTEXT: {
          conventions: ["use_custom_exception_types"]
        },
        SCOPE: {
          include: ["get_user_by_id"],
          exclude: ["create_user"]
        }
      },
      multiTokens: 45,
      ambiguities: [
        "Is 'custom exception types' a constraint or context?",
        "How strict is 'don't touch create_user'?"
      ]
    },
    {
      title: "Performance Optimisation",
      description: "Optimise a slow report generation function",
      singleChannel: `The report_generator.py file has a generate_monthly_report function that's really slow. Can you optimise it? But be careful - the output format is consumed by three other services so you absolutely cannot change the structure of the returned dictionary. I think the slowness is in the database queries but I'm not completely sure. We've tried caching before but it didn't help. Focus on this function and maybe the helper functions it calls, but don't modify the API endpoints.`,
      singleTokens: 90,
      multiChannel: {
        DATA: {
          files: ["report_generator.py"],
          functions: ["generate_monthly_report"],
          performance_profile: {
            current_latency_ms: 5000,
            target_latency_ms: 500
          }
        },
        ACTION: {
          primary: "optimise_performance",
          focus_areas: ["database_queries", "algorithm_complexity"]
        },
        CONSTRAINT: {
          critical: [{
            type: "preserve_output_format",
            reason: "consumed_by_three_services"
          }]
        },
        CONTEXT: {
          history: ["attempt_2024_03: caching_ineffective"]
        },
        META: {
          confidence: {
            root_cause_database: 0.7
          },
          priority: {
            performance: 10,
            maintainability: 6
          }
        },
        SCOPE: {
          include: ["generate_monthly_report", "helper_functions"],
          exclude: ["api_endpoints"]
        }
      },
      multiTokens: 60,
      ambiguities: [
        "Uncertainty about root cause buried in prose",
        "Previous attempt (caching) mentioned but not structured",
        "Scope boundaries unclear ('maybe the helper functions')"
      ]
    },
    {
      title: "Architecture Refactoring",
      description: "Migrate authentication system from sessions to JWT",
      singleChannel: `I need to refactor the authentication system in auth.py. Specifically, move from session-based auth to JWT tokens. This affects the login, logout, and verify_session functions. You MUST maintain backwards compatibility because we have mobile apps in the wild that we can't update yet. The new code should follow our security guidelines document. I'm pretty confident this is the right approach but if you see any issues flag them. Only change auth.py and auth_utils.py, leave the user management stuff alone.`,
      singleTokens: 95,
      multiChannel: {
        DATA: {
          files: ["auth.py", "auth_utils.py"],
          functions: ["login", "logout", "verify_session"],
          external_references: ["security_guidelines.md"]
        },
        ACTION: {
          primary: "refactor_architecture",
          transformation: {
            from: "session_based_auth",
            to: "jwt_tokens"
          }
        },
        CONSTRAINT: {
          critical: [{
            type: "backwards_compatibility",
            reason: "deployed_mobile_apps_cannot_update"
          }, {
            type: "follow_guidelines",
            reference: "security_guidelines.md"
          }]
        },
        META: {
          confidence: {
            correct_approach: 0.8
          },
          verification: {
            flag_concerns: true,
            require_security_review: true
          }
        },
        SCOPE: {
          include: ["auth.py", "auth_utils.py"],
          exclude: ["user_management/*"]
        }
      },
      multiTokens: 70,
      ambiguities: [
        "Security guidelines referenced but not structured",
        "Confidence level implicit rather than quantified",
        "Review requirements buried in prose"
      ]
    }
  ];

  const currentScenario = scenarios[selectedScenario];
  const tokenSavings = ((currentScenario.singleTokens - currentScenario.multiTokens) / currentScenario.singleTokens * 100).toFixed(0);

  const ChannelBadge = ({ name, color }) => (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${color} mr-2 mb-2`}>
      {name}
    </span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MCAP
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-2">Multi-Channel AI Protocol</p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Breaking the von Neumann bottleneck in AI agent communication
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Choose a Scenario:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedScenario(idx)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedScenario === idx
                    ? 'border-purple-500 bg-purple-900/30'
                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                }`}
              >
                <h3 className="font-semibold mb-2">{scenario.title}</h3>
                <p className="text-sm text-gray-400">{scenario.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Single Channel */}
          <div className="bg-red-900/20 border-2 border-red-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-red-300">Single-Channel (Current)</h3>
              </div>
              <div className="bg-red-800/50 px-3 py-1 rounded-full text-sm font-semibold">
                {currentScenario.singleTokens} tokens
              </div>
            </div>
            
            <div className="bg-black/30 rounded p-4 mb-4 font-mono text-sm text-gray-300 overflow-auto max-h-64">
              {currentScenario.singleChannel}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Ambiguities & Issues:
              </h4>
              <ul className="space-y-1">
                {currentScenario.ambiguities.map((amb, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{amb}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Multi Channel */}
          <div className="bg-green-900/20 border-2 border-green-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-green-300">Multi-Channel (MCAP)</h3>
              </div>
              <div className="bg-green-800/50 px-3 py-1 rounded-full text-sm font-semibold">
                {currentScenario.multiTokens} tokens
              </div>
            </div>

            <div className="bg-black/30 rounded p-4 mb-4 overflow-auto max-h-64">
              <pre className="font-mono text-xs text-gray-300">
                {JSON.stringify(currentScenario.multiChannel, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Benefits:
              </h4>
              <div className="flex flex-wrap">
                <ChannelBadge name="DATA" color="bg-blue-700" />
                <ChannelBadge name="ACTION" color="bg-purple-700" />
                <ChannelBadge name="CONSTRAINT" color="bg-red-700" />
                <ChannelBadge name="CONTEXT" color="bg-yellow-700" />
                <ChannelBadge name="META" color="bg-pink-700" />
                <ChannelBadge name="SCOPE" color="bg-green-700" />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Zero ambiguity • Explicit separation • Cacheable channels • Parallel processing
              </p>
            </div>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-2 border-purple-700/50 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-bold">Efficiency Gains</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400 mb-2">{tokenSavings}%</div>
              <div className="text-sm text-gray-400">Token Reduction</div>
              <div className="mt-2 text-xs text-gray-500">
                {currentScenario.singleTokens} → {currentScenario.multiTokens} tokens
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400 mb-2">6</div>
              <div className="text-sm text-gray-400">Parallel Channels</div>
              <div className="mt-2 text-xs text-gray-500">
                Simultaneous processing pathways
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
              <div className="text-sm text-gray-400">Ambiguities</div>
              <div className="mt-2 text-xs text-gray-500">
                vs. {currentScenario.ambiguities.length} in single-channel
              </div>
            </div>
          </div>
        </div>

        {/* Channel Explanation */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">The Six Channels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "DATA", color: "blue", desc: "What to operate on", icon: "📦" },
              { name: "ACTION", color: "purple", desc: "Operations to perform", icon: "⚡" },
              { name: "CONSTRAINT", color: "red", desc: "Hard boundaries", icon: "🚫" },
              { name: "CONTEXT", color: "yellow", desc: "Background info", icon: "💡" },
              { name: "META", color: "pink", desc: "Confidence & priorities", icon: "🎯" },
              { name: "SCOPE", color: "green", desc: "What's in/out of bounds", icon: "🎪" }
            ].map((channel) => (
              <div key={channel.name} className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{channel.icon}</span>
                  <span className={`font-bold text-${channel.color}-400`}>{channel.name}</span>
                </div>
                <p className="text-sm text-gray-400">{channel.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              For Developers
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>No more ambiguous prompts - each concern is explicit</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>Reuse context and constraints across multiple requests</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>Better debugging - see exactly what the AI understood</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              For AI Systems
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>Parallel processing of independent channels</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>Dedicated constraint validation prevents violations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>Intelligent caching reduces redundant processing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Break the Bottleneck?</h3>
          <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
            MCAP represents a fundamental shift in how AI agents communicate. Join the revolution in making AI agents more efficient, precise, and reliable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-purple-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Read the Full Specification
            </button>
            <button className="bg-purple-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors border-2 border-white">
              View on GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Multi-Channel AI Protocol (MCAP) v0.1 • December 2024</p>
          <p className="mt-2">Breaking the von Neumann bottleneck in AI communication</p>
        </div>
      </div>
    </div>
  );
};

export default MCAPDemo;