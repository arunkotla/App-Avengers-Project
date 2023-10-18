import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import NFTTile from './NFTTile';
import MarketplaceJSON from '../Marketplace.json';
import axios from 'axios';
import { GetIpfsUrlFromPinata } from '../utils';
import { ethers } from 'ethers';

export default function Marketplace() {
    // State variables for storing data and fetching status
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);

    //Using useEffect hook for fetching NFTs
    useEffect(() => {
        // Function to get all NFTs from the blockchain
        async function getAllNFTs() {
            try {
                // Checking if Ethereum is available in the browser
                if (window.ethereum === undefined) return;

                // Setting up provider and signer
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                // Instantiating the contract
                let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

                // Fetching all NFTs
                let transaction = await contract.getAllNFTs();

                // Retrieving data for each NFT
                const items = await Promise.all(
                    transaction.map(async i => {
                        let tokenURI = await contract.tokenURI(i.tokenId);
                        console.log('getting this tokenUri', tokenURI);

                        // Converting IPFS URI to a readable URL
                        tokenURI = GetIpfsUrlFromPinata(tokenURI);

                        // Fetching metadata from the URL
                        let meta = await axios.get(tokenURI);
                        meta = meta.data;

                        // Format price and create item object
                        let price = i.price ? ethers.utils.formatUnits(i.price.toString(), 'ether') : 'N/A';
                        let item = {
                            price,
                            tokenId: i.tokenId.toNumber(),
                            seller: i.seller,
                            owner: i.owner,
                            image: meta.image,
                            name: meta.name,
                            description: meta.description,
                        };
                        return item;
                    })
                );

                // Updating the fetched status and data
                updateFetched(true);
                updateData(items);
            } catch (error) {
                console.error('Error fetching NFTs: ', error);
            }
        }

        // Calling the function only if data has not been fetched yet
        if (!dataFetched) {
            getAllNFTs();
        }
    }, [dataFetched]);

    // JSX code for rendering the component
    return (
        <div>
            <Navbar />
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white">Top NFTs</div>
                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                    {data.map((value, index) => {
                        // Render NFTTile for each item in data
                        return <NFTTile data={value} key={index} />;
                    })}
                </div>
            </div>
        </div>
    );
}
