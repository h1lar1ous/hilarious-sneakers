import React, {useEffect, useState} from 'react';
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from './pages/Home';
import axios from "axios";
import {Route, Routes} from "react-router-dom";
import Favorites from "./pages/Favorites";

function App() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [cartOpened, setCartOpened] = useState(false);

    useEffect(() => {
        axios.get('https://63061b55697408f7edd2dc32.mockapi.io/items').then(res => {
            setItems(res.data);
        });
        axios.get('https://63061b55697408f7edd2dc32.mockapi.io/cart').then(res => {
            setCartItems(res.data);
        });
        axios.get('https://63061b55697408f7edd2dc32.mockapi.io/favorites').then(res => {
            setFavorites(res.data);
        });
    }, []);

    const onAddToCart = (obj) => {
        if(cartItems.find((item) => Number(item.id) === Number(obj.id))) {
            axios.delete(`https://63061b55697408f7edd2dc32.mockapi.io/cart/${obj.id}`);
            setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
        } else {
            axios.post('https://63061b55697408f7edd2dc32.mockapi.io/cart', obj);
            setCartItems(prev =>[...prev, obj]);
        }
    }

    const onRemoveItem = (id) => {
        axios.delete(`https://63061b55697408f7edd2dc32.mockapi.io/cart/${id}`);
        setCartItems(prev => prev.filter(item => item.id !== id));
    }

    const onAddToFavorite = async (obj) => {
        try {
            if(favorites.find((favObj) => favObj.id === obj.id)) {
                axios.delete(`https://63061b55697408f7edd2dc32.mockapi.io/favorites/${obj.id}`);
            } else {
                const { data } = await axios.post('https://63061b55697408f7edd2dc32.mockapi.io/favorites', obj);
                setFavorites(prev =>[...prev, data]);
            }
        } catch (error) {
            alert('не добавилось в фавориты');
        }
    }

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    }

  return (
    <div className="wrapper clear">
        {cartOpened && <Drawer onRemove={onRemoveItem} items={cartItems} onClose={() => setCartOpened(false)} />}
        <Header
            onClickCart={() => setCartOpened(true)}
        />

        <Routes>
            <Route
                path="/"
                exact
                element={
                <Home
                    items={items}
                    cartItems={cartItems}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    onChangeSearchInput={onChangeSearchInput}
                    onAddToFavorite={onAddToFavorite}
                    onAddToCart={onAddToCart}
                />
                }
            />
            <Route path="/favorites" exact element={<Favorites items={favorites} onAddToFavorite={onAddToFavorite} />} />
        </Routes>

    </div>
  );
}

export default App;
