import React, { useState, useEffect, useRef } from 'react';
import { Search, Star, Heart, Film, Tv, User, LogOut, Home, TrendingUp, X, Play, Calendar, Clock, Mail, Lock, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';

const API_KEY = '1ab28df915798db504d5fb90d103be5f';
const API_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKEND_URL = 'http://localhost:5000';

const EZSFinder = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPageResults, setSearchPageResults] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [userRatings, setUserRatings] = useState({});
  const [authForm, setAuthForm] = useState({ nome: '', email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerMovies, setBannerMovies] = useState([]);

  useEffect(() => {
    fetchTrending();
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserFavorites();
      loadUserRatings();
    }
  }, [user]);

  useEffect(() => {
    if (bannerMovies.length > 0) {
      const interval = setInterval(() => {
        setBannerIndex(prev => (prev + 1) % 5);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bannerMovies]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  const loadUserFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.map(fav => ({
          id: fav.titulo_id,
          media_type: fav.tipo,
          title: fav.titulo,
          name: fav.titulo,
          poster_path: fav.poster_path,
          vote_average: parseFloat(fav.vote_average)
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const loadUserRatings = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/ratings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const ratingsObj = {};
        data.forEach(rating => {
          ratingsObj[`${rating.titulo_id}-${rating.tipo}`] = rating.nota;
        });
        setUserRatings(ratingsObj);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = authMode === 'login' ? { email: authForm.email, senha: authForm.senha } : authForm;
    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setShowAuthModal(false);
        setAuthForm({ nome: '', email: '', senha: '' });
        setMessage({ type: 'success', text: authMode === 'login' ? 'Login realizado!' : 'Conta criada!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Erro na autenticação' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setFavorites([]);
    setUserRatings({});
    setCurrentPage('home');
  };

  const fetchTrending = async () => {
    try {
      const [moviesRes, seriesRes] = await Promise.all([
        fetch(`${API_BASE}/trending/movie/week?api_key=${API_KEY}&language=pt-BR`),
        fetch(`${API_BASE}/trending/tv/week?api_key=${API_KEY}&language=pt-BR`)
      ]);
      const moviesData = await moviesRes.json();
      const seriesData = await seriesRes.json();
      setTrendingMovies(moviesData.results.slice(0, 10));
      setTrendingSeries(seriesData.results.slice(0, 10));
      setBannerMovies(moviesData.results.slice(0, 5));
    } catch (error) {
      console.error('Erro ao buscar trending:', error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/search/multi?api_key=${API_KEY}&language=pt-BR&query=${query}`);
      const data = await res.json();
      setSearchResults(data.results.filter(item => item.media_type !== 'person').slice(0, 8));
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/search/multi?api_key=${API_KEY}&language=pt-BR&query=${searchQuery}`);
      const data = await res.json();
      setSearchPageResults(data.results.filter(item => item.media_type !== 'person'));
      setCurrentPage('search');
      setSearchResults([]);
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const fetchDetails = async (id, type) => {
    try {
      const [detailsRes, creditsRes, videosRes] = await Promise.all([
        fetch(`${API_BASE}/${type}/${id}?api_key=${API_KEY}&language=pt-BR`),
        fetch(`${API_BASE}/${type}/${id}/credits?api_key=${API_KEY}&language=pt-BR`),
        fetch(`${API_BASE}/${type}/${id}/videos?api_key=${API_KEY}&language=pt-BR`)
      ]);
      const details = await detailsRes.json();
      const credits = await creditsRes.json();
      const videos = await videosRes.json();
      setSelectedItem({
        ...details,
        media_type: type,
        cast: credits.cast.slice(0, 10),
        trailer: videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
      });
      setCurrentPage('details');
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    }
  };

  const toggleFavorite = async (item) => {
    if (!user) {
      setMessage({ type: 'error', text: 'Faça login para adicionar favoritos!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      setShowAuthModal(true);
      return;
    }
    const token = localStorage.getItem('token');
    const itemId = `${item.id}-${item.media_type}`;
    const isFav = favorites.some(fav => `${fav.id}-${fav.media_type}` === itemId);
    try {
      if (isFav) {
        const res = await fetch(`${BACKEND_URL}/api/favorites/${item.id}/${item.media_type}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setFavorites(favorites.filter(fav => `${fav.id}-${fav.media_type}` !== itemId));
          setMessage({ type: 'success', text: 'Removido dos favoritos!' });
        }
      } else {
        const res = await fetch(`${BACKEND_URL}/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            titulo_id: item.id,
            tipo: item.media_type,
            titulo: item.title || item.name,
            poster_path: item.poster_path,
            vote_average: item.vote_average
          })
        });
        if (res.ok) {
          setFavorites([...favorites, item]);
          setMessage({ type: 'success', text: 'Adicionado aos favoritos!' });
        }
      }
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar favoritos' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const isFavorite = (item) => {
    return favorites.some(fav => fav.id === item.id && fav.media_type === item.media_type);
  };

  const rateItem = async (itemId, mediaType, rating) => {
    if (!user) {
      setMessage({ type: 'error', text: 'Faça login para avaliar!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      setShowAuthModal(true);
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BACKEND_URL}/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ titulo_id: itemId, tipo: mediaType, nota: rating })
      });
      if (res.ok) {
        setUserRatings({ ...userRatings, [`${itemId}-${mediaType}`]: rating });
        setMessage({ type: 'success', text: `Avaliação ${rating}/10 salva!` });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar avaliação' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const MediaCard = ({ item }) => {
    const title = item.title || item.name;
    const poster = item.poster_path ? `${IMG_BASE}${item.poster_path}` : 'https://via.placeholder.com/300x450/1a1a2e/fff?text=Sem+Imagem';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    return (
      <div className="relative group cursor-pointer w-48 flex-shrink-0 transform transition-all duration-300 hover:scale-105 hover:z-10">
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <img src={poster} alt={title} className="w-full h-auto" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <button onClick={() => fetchDetails(item.id, item.media_type)} className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Ver Detalhes
              </button>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }} className="absolute top-2 right-2 bg-black/60 p-2 rounded-full hover:bg-black/80 transition-all duration-300 hover:scale-110">
            <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite(item) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
          <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded-lg font-bold text-sm flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" />{rating}
          </div>
        </div>
        <h3 className="mt-2 font-semibold text-white line-clamp-2">{title}</h3>
        <p className="text-gray-400 text-sm">{item.media_type === 'movie' ? 'Filme' : 'Série'}</p>
      </div>
    );
  };

  const ScrollableRow = ({ children, title, icon: Icon }) => {
    const scrollRef = useRef(null);
    const scroll = (direction) => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: direction === 'left' ? -800 : 800, behavior: 'smooth' });
      }
    };
    return (
      <div className="relative group">
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon className="w-6 h-6 text-red-600" />}
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-red-600 text-white p-3 rounded-r-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
          {children}
        </div>
        <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-red-600 text-white p-3 rounded-l-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowAuthModal(false)}>
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full relative my-8 max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">{authMode === 'login' ? 'Entrar' : 'Criar Conta'}</h2>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-white text-sm mb-2 block">Nome</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" value={authForm.nome} onChange={(e) => setAuthForm({ ...authForm, nome: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600" placeholder="Seu nome" required />
                  </div>
                </div>
              )}
              <div>
                <label className="text-white text-sm mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600" placeholder="seu@email.com" required />
                </div>
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="password" value={authForm.senha} onChange={(e) => setAuthForm({ ...authForm, senha: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600" placeholder="••••••" required minLength="6" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Aguarde...' : authMode === 'login' ? 'Entrar' : 'Criar Conta'}
                {authMode === 'register' && <UserPlus className="w-5 h-5" />}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setMessage({ type: '', text: '' }); }} className="text-red-500 hover:text-red-400">
                {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <Film className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-white">EZSFLIX</span>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Buscar filmes e séries... (Pressione Enter)" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); handleSearch(e.target.value); }} className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600" />
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-50">
                  {searchResults.map(item => (
                    <div key={`${item.id}-${item.media_type}`} onClick={() => { fetchDetails(item.id, item.media_type); setSearchQuery(''); setSearchResults([]); }} className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors">
                      <img src={item.poster_path ? `${IMG_BASE}${item.poster_path}` : 'https://via.placeholder.com/50x75/1a1a2e/fff?text=?'} alt={item.title || item.name} className="w-12 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.title || item.name}</p>
                        <p className="text-gray-400 text-sm">{item.media_type === 'movie' ? 'Filme' : 'Série'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentPage('home')} className={`p-2 rounded-lg transition-colors ${currentPage === 'home' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                <Home className="w-6 h-6" />
              </button>
              <button onClick={() => setCurrentPage('favorites')} className={`p-2 rounded-lg transition-colors ${currentPage === 'favorites' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                <Heart className="w-6 h-6" />
              </button>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-white"><p className="font-semibold">{user.nome}</p></div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white transition-colors" title="Sair">
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2">
                  <User className="w-5 h-5" />Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white text-center font-semibold`}>
            {message.text}
          </div>
        )}

        {currentPage === 'home' && (
          <div className="space-y-8">
            {bannerMovies.length > 0 && (
              <div className="relative h-96 rounded-xl overflow-hidden group">
                <img src={`https://image.tmdb.org/t/p/original${bannerMovies[bannerIndex].backdrop_path}`} alt={bannerMovies[bannerIndex].title} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent">
                  <div className="absolute bottom-12 left-12 max-w-2xl">
                    <h1 className="text-5xl font-bold text-white mb-4">{bannerMovies[bannerIndex].title}</h1>
                    <p className="text-gray-200 text-lg mb-6 line-clamp-3">{bannerMovies[bannerIndex].overview}</p>
                    <div className="flex gap-4">
                      <button onClick={() => fetchDetails(bannerMovies[bannerIndex].id, 'movie')} className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 flex items-center gap-2 hover:scale-105">
                        <Play className="w-5 h-5" />Ver Detalhes
                      </button>
                      <button onClick={() => toggleFavorite({ ...bannerMovies[bannerIndex], media_type: 'movie' })} className="bg-white/20 backdrop-blur text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-2 hover:scale-105">
                        <Heart className={isFavorite({ ...bannerMovies[bannerIndex], media_type: 'movie' }) ? 'fill-current' : ''} />Favoritar
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setBannerIndex((bannerIndex - 1 + 5) % 5)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={() => setBannerIndex((bannerIndex + 1) % 5)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {bannerMovies.map((_, idx) => (
                    <button key={idx} onClick={() => setBannerIndex(idx)} className={`w-3 h-3 rounded-full transition-all duration-300 ${bannerIndex === idx ? 'bg-red-600 w-8' : 'bg-white/50 hover:bg-white'}`} />
                  ))}
                </div>
              </div>
            )}
            <ScrollableRow title="Filmes em Alta" icon={TrendingUp}>
              {trendingMovies.map(movie => <MediaCard key={movie.id} item={{ ...movie, media_type: 'movie' }} />)}
            </ScrollableRow>
            <ScrollableRow title="Séries em Alta" icon={Tv}>
              {trendingSeries.map(series => <MediaCard key={series.id} item={{ ...series, media_type: 'tv' }} />)}
            </ScrollableRow>
          </div>
        )}

        {currentPage === 'search' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Resultados para: "{searchQuery}"</h1>
              <p className="text-gray-400">{searchPageResults.length} resultados</p>
            </div>
            {searchPageResults.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhum resultado encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchPageResults.map(item => <MediaCard key={`${item.id}-${item.media_type}`} item={item} />)}
              </div>
            )}
          </div>
        )}

        {currentPage === 'details' && selectedItem && (
          <div className="space-y-6">
            <div className="relative h-96 rounded-xl overflow-hidden group">
              {selectedItem.backdrop_path && <img src={`https://image.tmdb.org/t/p/original${selectedItem.backdrop_path}`} alt={selectedItem.title || selectedItem.name} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-48 relative z-10 px-4">
              <div className="space-y-4">
                {selectedItem.poster_path && <img src={`${IMG_BASE}${selectedItem.poster_path}`} alt={selectedItem.title || selectedItem.name} className="rounded-lg shadow-2xl w-full transform transition-transform duration-300 hover:scale-105" />}
                <button onClick={() => toggleFavorite(selectedItem)} className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 ${isFavorite(selectedItem) ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white/20 backdrop-blur text-white hover:bg-white/30'}`}>
                  <Heart className={isFavorite(selectedItem) ? 'fill-current' : ''} />
                  {isFavorite(selectedItem) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </button>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{selectedItem.title || selectedItem.name}</h1>
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedItem.release_date || selectedItem.first_air_date}
                    </div>
                    {selectedItem.runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedItem.runtime} min
                      </div>
                    )}
                    <div className="flex items-center gap-1 bg-yellow-500 text-black px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-current" />
                      {selectedItem.vote_average ? selectedItem.vote_average.toFixed(1) : 'N/A'}
                    </div>
                  </div>
                </div>
                {selectedItem.genres && (
                  <div className="flex gap-2 flex-wrap">
                    {selectedItem.genres.map(genre => (
                      <span key={genre.id} className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">{genre.name}</span>
                    ))}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Sinopse</h2>
                  <p className="text-gray-300 leading-relaxed">{selectedItem.overview}</p>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Sua Avaliação</h2>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => {
                      const itemId = `${selectedItem.id}-${selectedItem.media_type}`;
                      const userRating = userRatings[itemId] || 0;
                      return (
                        <button key={rating} onClick={() => rateItem(selectedItem.id, selectedItem.media_type, rating)} className={`w-10 h-10 rounded-lg font-bold transition-all duration-300 hover:scale-110 ${userRating >= rating ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                          {rating}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedItem.trailer && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">Trailer</h2>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedItem.trailer.key}`} title="Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  </div>
                )}
                {selectedItem.cast && selectedItem.cast.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">Elenco</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {selectedItem.cast.map(actor => (
                        <div key={actor.id} className="text-center transform transition-transform duration-300 hover:scale-105">
                          <img src={actor.profile_path ? `${IMG_BASE}${actor.profile_path}` : 'https://via.placeholder.com/150x200/1a1a2e/fff?text=Sem+Foto'} alt={actor.name} className="rounded-lg w-full h-40 object-cover mb-2" />
                          <p className="text-white font-semibold text-sm">{actor.name}</p>
                          <p className="text-gray-400 text-xs">{actor.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'favorites' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-600" />
              Meus Favoritos
            </h1>
            {!user ? (
              <div className="text-center py-20">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">Faça login para ver seus favoritos</p>
                <button onClick={() => setShowAuthModal(true)} className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  Fazer Login
                </button>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Você ainda não tem favoritos</p>
                <p className="text-gray-500">Adicione filmes e séries aos favoritos para vê-los aqui</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favorites.map(item => <MediaCard key={`${item.id}-${item.media_type}`} item={item} />)}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-black/50 border-t border-gray-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="mb-2">© 2025 EZSFLIX. Todos os direitos reservados.</p>
          <p className="text-sm">Dados fornecidos por The Movie Database (TMDB)</p>
        </div>
      </footer>
    </div>
  );
};

export default EZSFinder;