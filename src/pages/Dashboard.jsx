import { useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Heart, MessageCircle, Share } from 'lucide-react';

const Dashboard = () => {
  const [jobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp',
      location: 'Remote',
      salary: '$120K - $150K',
      type: 'Full-time',
      postedTime: '2 hours ago',
      description: 'We are looking for a senior React developer to join our growing team...',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      location: 'San Francisco, CA',
      salary: '$90K - $120K',
      type: 'Full-time',
      postedTime: '4 hours ago',
      description: 'Create beautiful and intuitive user experiences for our mobile and web applications...',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      logo: 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'New York, NY',
      salary: '$110K - $140K',
      type: 'Full-time',
      postedTime: '6 hours ago',
      description: 'Manage and optimize our cloud infrastructure and deployment pipelines...',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      logo: 'https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ]);

  const [posts] = useState([
    {
      id: 1,
      author: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '3 hours ago',
      content: 'Just launched my new React project! The feeling of seeing your code come to life never gets old. 🚀',
      likes: 42,
      comments: 8,
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 2,
      author: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '5 hours ago',
      content: 'Tips for junior developers: 1. Practice consistently 2. Build projects 3. Network with other developers 4. Never stop learning',
      likes: 128,
      comments: 24
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to your Dashboard</h1>
          <p className="text-gray-300">Discover opportunities and connect with professionals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Briefcase className="w-6 h-6 mr-3 text-purple-400" />
                Job Opportunities
              </h2>
              
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                          <p className="text-purple-400 font-medium">{job.company}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                        {job.postedTime}
                      </span>
                    </div>

                    <div className="flex items-center space-x-6 text-gray-300 text-sm mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.type}
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                        Apply Now
                      </button>
                      <button className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/20 transition-all duration-300">
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Network Activity</h2>
              
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-white font-medium">{post.author}</h4>
                        <p className="text-gray-400 text-sm">{post.time}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-3">{post.content}</p>
                    
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                    )}
                    
                    <div className="flex items-center space-x-6 text-gray-400">
                      <button className="flex items-center space-x-1 hover:text-red-400 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                        <Share className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Your Stats</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Profile Views</span>
                  <span className="text-purple-400 font-semibold">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Applications Sent</span>
                  <span className="text-pink-400 font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Network Connections</span>
                  <span className="text-cyan-400 font-semibold">234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;